"use strict";

// UserView
Session.UserView = React.createClass({

  getInitialState: function () {
    return { data: [] };
  },

  componentDidMount: function() {
    this.fetchUser();
  },

  fetchUser: function () {
    var that = this;
    Session.user.fetchFromCookie(function(user) {
      if (user.hasAuthenticated() === true) {
        $(".user-profile-info").html(Session.user.fullname);
      }
      that.setState({username: Session.user.username});
      that.setState({fullname: Session.user.fullname});
      that.setState({password: Cookies.get("password")});
    });
  },

  handleSignOn: function (e) {
    if (e) { e.preventDefault(); }
    if (!this.state.username || !this.state.password ) { return; }
    var that = this;
    Session.user.signon(this.state.password.trim(), function(results){
      if (Session.user.hasAuthenticated() === true) {
        alert("Sign in success.");
        if (typeof Session.scenarioId != "undefined") {
          window.location = "play.html#"+Session.scenarioId;
        }
      } else {
        alert("Failed to sign in.");
      }
    });
  },

  handleRegister: function (e){
    e.preventDefault();
    if (!this.state.username || !this.state.password ) { return; }
    Session.user.register(this.state.password.trim(), function () {
      // Registered
      alert("Registered.");
      window.location = "play.html#"+Session.scenarioId;
    }, function () {
      // Failed to register
      alert("Failed to registered.");
    });
  },

  handleUsername: function(e) {
    Session.user.username = e.target.value;
    this.setState({username: e.target.value});
  },

  handlePassword: function(e) {
    this.setState({password: e.target.value});
  },

  handleFullname: function(e) {
    Session.user.fullname = e.target.value;
    this.setState({fullname: e.target.value});
  },

  render: function () {
    return (
      <div className="user-view">
        <form className="scenarioForm" onSubmit={this.handleSignOn}>
          <input type="text" placeholder="Username" value={this.state.username} onChange={this.handleUsername}/>
          <input type="password" placeholder="Password" value={this.state.password} onChange={this.handlePassword}/>
          <input type="text" placeholder="Full name" value={this.state.fullname} onChange={this.handleFullname}/>
          <input type="submit" onClick={this.handleSignOn} name="action" value="Sign in"/>
          <input type="submit" onClick={this.handleRegister} name="action" value="Register"/>
        </form>
      </div>
    );
  }

});


ReactDOM.render(<Session.UserView />, document.getElementById('react-container'));
