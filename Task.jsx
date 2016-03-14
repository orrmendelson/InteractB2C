// Task component - represents a single todo item
Task = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired
},

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this.props.task._id, ! this.props.task.checked);

  },

  deleteThisTask() {
    Meteor.call("removeTask", this.props.task._id);
  },

  createMarkup() {
    return {__html: '<strong>MMM</strong>'};
  },

  togglePrivate() {
    Meteor.call("setPrivate", this.props.task._id, ! this.props.task.private);
  },

  createIntTag(tagStr) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("data-key", "int-scr-loader");
    script.setAttribute("src", tagStr);
    this.refs.intContainer.appendChild(script);
    // document.getElementsByTagName("int1")[0].appendChild(script);
  },

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    // Add "checked" and/or "private" to the className when needed
    const taskClassName = (this.props.task.checked ? "checked" : "") + " " +
      (this.props.task.private ? "private" : "");

    return (
      <div>

        { this.props.showPrivateButton ? (
          <button className="delete" onClick={this.deleteThisTask}>
            &times;
          </button>
        ) : ''}

        <div className="author">
          Task publisher: <strong>{this.props.task.username}</strong>
          &nbsp; &nbsp; complete:  
          <input
            type="checkbox"
            readOnly={true}
            checked={this.props.task.checked}
            onClick={this.toggleChecked} />

          { this.props.showPrivateButton ? (
            <button className="toggle-private" onClick={this.togglePrivate}>
              { this.props.task.private ? "Publish it" : "Make private" }
            </button>
          ) : ''}


        </div>

        <div ref="intContainer" dangerouslySetInnerHTML={{__html: ''}}/>
      </div>
    );
  },

  componentDidMount:function(){
    this.createIntTag(this.props.task.text);
  }
});
