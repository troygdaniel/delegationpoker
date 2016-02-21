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
        $(".user-profile-info").html(Session.user.fullname);
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
    if (App.isNewScenario() === true || App.userHasCreatedScenario() === true) {
      this.setState({scenarioName: e.target.value});
    } else {
      App.errorMessage("Sorry, only the owner can edit the scenario.");
    }
  },

  hasValidationErrors: function () {
    if (Session.user.hasAuthenticated() === false) {
      return App.errorMessage("You must be signed in to create a scenario.");
    }
    if (!this.state.scenarioName) {
      return App.errorMessage("Please provide a scenario name.");
    }
    return false;
  },

  handleScenarioSubmit: function(e) {
    e.preventDefault();
    if (this.hasValidationErrors() === true) { return; }

    if (App.isNewScenario() === true) {
      App.saveScenario(Session.user, this.state.scenarioName);
    } else {
      if (App.userHasCreatedScenario() === true) {
        App.updateScenario(this.state.scenarioName);
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
          App.errorMessage("Scenario was not found.");
        } else {
          that.setState({scenarioName: Session.scenario.name});
          that.setState({votes: Session.scenario.votes});
        }
      });
    }
  },

  showCreateButton: function () {
    if (App.isNewScenario() === true) {
      return (<span><br/><input className="save-button" onClick={this.handleScenarioSubmit} type="submit" value="Create New Scenario"/></span>)
    } else {
      return;
    }
  },

  toggleAllVotes: function (argument) {
    this.fetchScenario();
    $("#all-votes").toggle();
    if (this.areVotesVisible === true) {
      this.areVotesVisible = false;
      $("#toggle-cards-button").text("Show all Cards");
    } else {
      this.areVotesVisible = true;
      $("#toggle-cards-button").text("Hide all Cards");
    }
  },

  showVoting: function () {
    if (App.isNewScenario() === false) {
      return (
        <div>
          <Session.CastVoteView onVoteSubmit={this.fetchScenario}/>
          <a id="toggle-cards-button" className="button alt small" onClick={this.toggleAllVotes}>Show all cards</a>
          <br/><br/>
          {this.votes()}
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
        <div id="all-votes" className="hidden">
        <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Selected Card</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      </div>
      );
    }
  },

  render: function () {
    return (
      <div className="scenario-view">
        <form className="scenarioForm" onSubmit={this.handleScenarioSubmit}>
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
      App.errorMessage("Please sign in before voting.");
    } else {
      App.infoMessage("Vote saved.");
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
