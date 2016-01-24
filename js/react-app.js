"use strict";

// UserView
var UserView = React.createClass({

  getInitialState: function () {
    return { data: [] };
  },

  getUser: function () {    
    Session.user = new User({username:this.state.username.trim(), fullname: this.state.username});    
    return Session.user;    
  },

  handleSignOn: function (e) {
    e.preventDefault(); 
    if (!this.state.username || !this.state.password ) { return; }
    this.getUser().signon(this.state.password.trim(), function(){
      // Signon success
      alert("Sign on success.");
    }, function() {
      // Failed to sign on
      alert("Failed to sign on.");
    });
  },

  handleRegister: function (e){
    e.preventDefault();
    if (!this.state.username || !this.state.password ) { return; }
    this.getUser().register(this.state.password.trim(), function () {
      // Registered
      alert("Registered.");
    }, function () {
      // Failed to register
      alert("Failed to registered.");
    });
  },

  handleUsername: function(e) {
    this.setState({username: e.target.value});
  },

  handlePassword: function(e) {
    this.setState({password: e.target.value});
  },

  render: function () {
    return (
      <div className="user-view">
        <form className="scenarioForm" onSubmit={this.handleSignOn}>
        <input type="text" placeholder="Username" value={this.state.username} onChange={this.handleUsername}/>      
       <input type="text" placeholder="Password" value={this.state.password} onChange={this.handlePassword}/>      
        <input type="submit" onClick={this.handleSignOn} name="action" value="Signon"/>
        <input type="submit" onClick={this.handleRegister} name="action" value="Register"/>
        </form>
        <ScenarioView />
      </div>
    );
  }

});

// ScenarioView
var ScenarioView = React.createClass({

  getInitialState: function () {
    return { data: [] };
  },

  handleScenarioName: function(e) {
    this.setState({scenarioName: e.target.value});
  },

  handleSubmit: function(e) {
    console.log("handleSubmit");
    e.preventDefault(); 
    if (!this.state.scenarioName || typeof Session.user === "undefined") { return; }
    this.scenario = new Scenario({user: Session.user, name: this.state.scenarioName});
    Session.scenario = this.scenario.save();
    alert("Saved Scenario.");

  },
  render: function () {
    return (
      <div className="scenario-view">
      <form className="scenarioForm" onSubmit={this.handleSubmit}>
      <input type="text" placeholder="Scenario name" value={this.state.scenarioName} onChange={this.handleScenarioName}/>      
      <input onClick={this.handleSubmit} type="submit" value="Save"/>
      </form>
      <VoteView/>
      </div>
    );
  }
});

// VoteView
var VoteView = React.createClass({

  getInitialState: function () {
    return { data: [] };
  },

  handleCardValue: function(e) {
    this.setState({cardValue: e.target.value});
  },

  handleSubmit: function(e) {
    console.log("handleSubmit");
    e.preventDefault(); 
    if (!this.state.cardValue || typeof Session.user === "undefined" || typeof Session.scenario === "undefined") { return; }
    Session.user.vote(Session.scenario, this.state.cardValue);
    alert("Vote saved.");

  },
  render: function () {
    return (
      <div className="vote-view">
        <form className="voteForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Value 1-7" value={this.state.cardValue} onChange={this.handleCardValue}/>      
        <input onClick={this.handleSubmit} type="submit" value="Vote"/>
        </form>
      </div>
    );
  }
});

ReactDOM.render(<UserView />, document.getElementById('container'));