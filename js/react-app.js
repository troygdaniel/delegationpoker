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
    Session.user.fetchFromCookie(function() {
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
        alert("Sign on success.");  
        that.setState({fullname: Session.user.fullname});
      } else {
        alert("Failed to sign on.");  
      }    
    });
  },

  handleRegister: function (e){
    e.preventDefault();
    if (!this.state.username || !this.state.password ) { return; }
    Session.user.register(this.state.password.trim(), function () {
      // Registered
      alert("Registered.");
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
        <input type="submit" onClick={this.handleSignOn} name="action" value="Signon"/>
        <input type="submit" onClick={this.handleRegister} name="action" value="Register"/>
        </form>
        <Session.ScenarioView scenario={Session.scenario}/>
      </div>
    );
  }

});

// ScenarioView
Session.ScenarioView = React.createClass({

  getInitialState: function () {
    return { scenarioName: Session.scenario.scenarioName };
  },

  handleScenarioName: function(e) {
    this.setState({scenarioName: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault(); 
    if (Session.user.hasAuthenticated() === false) {
      alert("You must be signed in to create a scenario.");
      return;
    }
    if (!this.state.scenarioName) { 
      alert("Please provide a scenario name.");
      return; 
    }
    // TODO: Update scenario if it exists
    if (typeof Session.scenario.rev === "undefined") {
      Session.scenario = new Scenario({user: Session.user, name: this.state.scenarioName});
      Session.scenario.save(function() {
        alert("Saved Scenario.");
        window.location.href="#"+Session.scenario.id;
      });
      window.location.href="#"+Session.scenario.id;

    } else {
      if (Session.user.username === Session.scenario.user.username) {
        Session.scenario.name = this.state.scenarioName;
        Session.scenario.update(function (doc){
          window.location.href="#"+Session.scenario.id;
          alert("Scenario updated.");
        });        
      } else {
        alert("You are not authorized to edit someone elses scenario.")
      }

    }
  },

  componentDidMount: function() {
    this.fetchScenario();
  },

  fetchScenario: function () {
    var that = this;
    // Fetch the scenario given a query string
    if (Session.scenarioId) {
      Session.scenario.get(Session.scenarioId, function (doc) {
        if (doc.error) { 
          console.error("Scenario '"+Session.scenarioId+"' not found."); 
        } else {
          that.setState({scenarioName: Session.scenario.name});
        }
      });
    }
  },

  render: function () {
    return (
      <div className="scenario-view">
      <form className="scenarioForm" onSubmit={this.handleSubmit}>
      <input type="text" placeholder="Scenario name" value={this.state.scenarioName} onChange={this.handleScenarioName}/>      
      <input onClick={this.handleSubmit} type="submit" value="Save"/>
      </form>
      <Session.VoteView/>
      </div>
    );
  }
});

// VoteView
Session.VoteView = React.createClass({

  getInitialState: function () {
    return { data: [] };
  },

  handleCardValue: function(e) {
    this.setState({cardValue: e.target.value});
  },

  handleSubmit: function(e) {
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

// TODO: Update location with scenario id
ReactDOM.render(<Session.UserView />, document.getElementById('container'));