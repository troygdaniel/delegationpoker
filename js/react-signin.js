"use strict";

// UserView
Session.UserView = React.createClass({

  getInitialState: function () {
    return { data: [] };
  },

  componentDidMount: function() {
    this.fetchUser();
    this.showSigninFields = true;
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
    console.log("handleSignOn");
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
    console.log("handleRegister");
    if (this.showSigninFields === true) {
      this.handleSignOn(e);
      return;
    }

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

  showSigninFieldsAction: function () {
    $(".signin-fields").show();
    $(".register-fields").hide();
    this.showSigninFields = true;
  },

  showRegisterFieldsAction: function()  {
    $(".signin-fields").hide();
    $(".register-fields").show();
    this.showSigninFields = false;
  },

  logoutAction: function () {
    Cookies.remove('username');
    Cookies.remove('password');
    window.location = "signin.html";
  },

  handleSubmit: function (e) {
    if (this.showSigninFields === false) {
      this.handleRegister(e);
    } else {
      this.handleSignOn(e);
    }
  },


  render: function () {
    return (
      <div className="user-view">
        <form className="scenarioForm" onSubmit={this.handleSubmit}>
          <span className="register-fields signin-fields"><input type="text" placeholder="Username" value={this.state.username} onChange={this.handleUsername}/></span>
          <span className="register-fields signin-fields"><input type="password" placeholder="Password" value={this.state.password} onChange={this.handlePassword}/></span>
          <span className="register-fields hidden" id="full-name"><input type="text" placeholder="Full name" value={this.state.fullname} onChange={this.handleFullname}/></span>
          <br/>
          <span className="signin-fields"> <a className="button small" onClick={this.handleSignOn} name="action">Sign in</a></span>
          &nbsp;
          <span className="signin-fields"><a className="button small alt" onClick={this.logoutAction}>Logout</a></span>
          <span className="signin-fields"><br/><br/><a onClick={this.showRegisterFieldsAction}>I need to create an account.</a></span>
          <br/>
          <span id="register-button" className="register-fields hidden"><input type="submit" onClick={this.handleRegister} name="action" value="Register"/></span>
          <br/>
          <span className="signin-fields hidden register-fields"><br/><a onClick={this.showSigninFieldsAction}>I have an account, let me sign in.</a></span>
        </form>
      </div>
    );
  }

});


ReactDOM.render(<Session.UserView />, document.getElementById('react-container'));
