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
      if (user.hasAuthenticated() === false) {
        window.location = "signin.html#"+Session.scenarioId;
      } else {
        $(".user-profile-info").html("You are signed in as "+Session.user.fullname);
        that.setState({username: Session.user.username});
        that.setState({fullname: Session.user.fullname});
        that.setState({password: Cookies.get("password")});
      }
    });
  },

  render: function () {
    return (
      <div className="user-view">        
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
        this.setState({scenarioName: Session.scenario.name});
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
          that.setState({votes: Session.scenario.votes});
        }
      });
    }
  },

  votes: function () {
     var rows = [];
     if (Session.scenario.votes) {
      for (var i = 0; i < Session.scenario.votes.length; i++) {
        var vote = Session.scenario.votes[i];
        rows.push( <div key={vote.id}>{vote.value.username} = {vote.value.card_value}</div> );
      }
      return (
        <div>{rows}</div>
      );      
    }
  },

  render: function () {
    return (
      <div className="scenario-view">
      <form className="scenarioForm" onSubmit={this.handleSubmit}>
      <input type="text" placeholder="Scenario name" value={this.state.scenarioName} onChange={this.handleScenarioName}/>      
      <input onClick={this.handleSubmit} type="submit" value="Save"/>
      </form>      
      <Session.AllVotesView onVoteSubmit={this.fetchScenario}/>
      <strong>Votes</strong> 
      {this.votes()}
      <button onClick={this.fetchScenario}>Get latest votes</button>
      </div>      
    );
  }
});

// AllVotesView
Session.AllVotesView = React.createClass({

  getInitialState: function () {
    return { data: [] };
  },

  handleCardValue: function(e) {
    this.setState({cardValue: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault(); 
    if (!this.state.cardValue || typeof Session.user === "undefined" || typeof Session.scenario === "undefined") { return; }

    if (Session.user.vote(Session.scenario, this.state.cardValue, this.props.onVoteSubmit) === false) {
      alert("Please sign in before voting.");
    } else {
      alert("Vote saved.");      
    }
  },

  componentDidMount: function () {
    setInterval(this.props.onVoteSubmit,30000)
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

ReactDOM.render(<Session.UserView />, document.getElementById('react-container'));