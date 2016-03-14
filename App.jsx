// App component - represents the whole app
App = React.createClass({

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    return {
      tasks: Tasks.find({}).fetch()
    }
  },

  renderTasks() {
    // Get tasks from this.data.tasks
    return this.data.tasks.map((task) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return <Task
        key={task._id}
        task={task}
        showPrivateButton={showPrivateButton} />;
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text: text,
      createdAt: new Date(),            // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username  // username of logged in user
    });

    Meteor.call("addTask", text);

    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";
  },

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let query = {};

    if (this.state.hideCompleted) {
      // If hide completed is checked, filter tasks
      query = {checked: {$ne: true}};
    }

    return {
      tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    };
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },

  render() {
    return (
    <div className="container">
      <header>
        <div><img src="/img/1on1.png"></img></div>
        <h1>Interactions List</h1>
        Completed: total {this.data.incompleteCount} |

        <label className="hide-completed">
          &nbsp; to hide <input
            type="checkbox"
            readOnly={true}
            checked={this.state.hideCompleted}
            onClick={this.toggleHideCompleted} />
        </label>

        <label>
          | <a href="http://interactions.herokuapp.com/" target="blank">Studio</a>&nbsp;
        </label>

        <label>
          | <span class="box"><a class="button" href="#popup1">How to</a></span>
        </label>

        <span className="login">
          <AccountsUIWrapper />
        </span>

        <div className="taskheader">
          <span className="newtask">
            { this.data.currentUser ?
              <form className="new-task" onSubmit={this.handleSubmit} >
                <input
                  type="text"
                  ref="textInput"
                  placeholder="Type to add new tasks" />
              </form> : ''
            }
          </span>
          <span className="displaydonetasks">

        </span>
      </div>
      </header>
       {this.renderTasks()}
    </div>
    );
  }
});
