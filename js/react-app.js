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
        that.setState({user: user});
        that.user = user;
        that.setState({username: Session.user.username});
        that.setState({fullname: Session.user.fullname});
        that.setState({password: Cookies.get("password")});
      }
    });
  },

  render: function () {
    return (
      <div className="user-view">
        <Session.ScenarioView/>
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
    if (typeof Session.scenario.rev === "undefined") {
      this.setState({scenarioName: e.target.value});
    } else if (Session.user.username === Session.scenario.user.username) {
      this.setState({scenarioName: e.target.value});
    } else {
      errorMessage("Sorry, only the owner can edit the scenario.");
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (Session.user.hasAuthenticated() === false) {
      errorMessage("You must be signed in to create a scenario.");
      return;
    }
    debugger
    if (!this.state.scenarioName) {
      errorMessage("Please provide a scenario name.");
      return;
    }
    if (typeof Session.scenario.rev === "undefined") {
      Session.scenario = new Scenario({user: Session.user, name: this.state.scenarioName});
      Session.scenario.save(function() {
        prompt("Copy and paste this link to play with others", window.location.href+"#"+Session.scenario.id);
        window.location.href="?reload="+Date.now()+"#"+Session.scenario.id;
      });
      if (typeof Session.scenario.rev != "undefined") {
        window.location.href="#"+Session.scenario.id;
      }
    } else {
      if (Session.user.username === Session.scenario.user.username) {
        Session.scenario.name = this.state.scenarioName;
        Session.scenario.update(function (doc){
          window.location.href="#"+Session.scenario.id;
          infoMessage("Scenario updated.");
        });
      } else {
        this.setState({scenarioName: Session.scenario.name});
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
  showCreateButton: function () {
    if (typeof Session.scenario.rev === "undefined") {
      return (<input className="save-button" onClick={this.handleSubmit} type="submit" value="Create"/>)
    } else {
      return;
    }
  },

  showVoting: function () {
    if (typeof Session.scenario.rev !== "undefined") {
      return (
        <div>
        <Session.CastVoteView onVoteSubmit={this.fetchScenario}/>
        {this.votes()}
        <button onClick={this.fetchScenario}>Get latest votes</button>
        </div>
      )
    } else {
      return;
    }
  },

  votes: function () {
     var rows = [];
     if (Session.scenario.votes) {
      for (var i = 0; i < Session.scenario.votes.length; i++) {
        var vote = Session.scenario.votes[i];
        rows.push( <tr key={vote.id}><td>{vote.value.fullname} </td><td>{vote.value.card_value} - {Card[vote.value.card_value]}</td></tr> );
      }
      return (
        <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Selected Card</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      );
    }
  },

  render: function () {
    return (
      <div className="scenario-view">
      <form className="scenarioForm" onSubmit={this.handleSubmit}>
      <span id="info-message">&nbsp;</span>
      <input type="text" placeholder="Scenario name" value={this.state.scenarioName} onChange={this.handleScenarioName}/>
      {this.showCreateButton()}
      </form>
      {this.showVoting()}
      </div>
    );
  }
});

// CastVoteView
Session.CastVoteView = React.createClass({

  getInitialState: function () {
    return { data: [] };
  },

  componentDidMount: function () {
    setInterval(this.props.onVoteSubmit,30000)
  },

  handleVote: function (e) {
    var $target = $(e.target);
    var vote_value = $target.data("value");
    $(".button").removeClass("special");
    $target.addClass("special");
    this.setState({cardValue: vote_value});

    if (!vote_value || typeof Session.user === "undefined" || typeof Session.scenario === "undefined") { return; }

    if (Session.user.vote(Session.scenario, vote_value, this.props.onVoteSubmit) === false) {
      errorMessage("Please sign in before voting.");
    } else {
      infoMessage("Vote saved.");
    }
  },

  render: function () {
    return (
      <section>
        <ul className="actions small">
          <li><a data-value="1" onClick={this.handleVote} className="button small fit">1 - Tell</a></li>
          <li><a data-value="2" onClick={this.handleVote} className="button small fit">2 - Sell</a></li>
          <li><a data-value="3" onClick={this.handleVote} className="button small fit">3 - Consult</a></li>
          <li><a data-value="4" onClick={this.handleVote} className="button small fit">4 - Agree</a></li>
          <li><a data-value="5" onClick={this.handleVote} className="button small fit">5 - Advise</a></li>
          <li><a data-value="6" onClick={this.handleVote} className="button small fit">6 - Inquire</a></li>
          <li><a data-value="7" onClick={this.handleVote} className="button small fit">7 - Delegate</a></li>
        </ul>
      </section>
    );
  }
});

ReactDOM.render(<Session.UserView />, document.getElementById('react-container'));
