"use strict";

// UserView
var UserView = React.createClass({

  getInitialState: function () {
    return { data: [] };
  },

  componentDidMount: function() {
    // TODO: get rid of Session.scenarioId
    this.setState({scenarioId: Session.scenarioId});
    this.fetchUser();
  },

  fetchUser: function () {
    var that = this;
    var _user = new User();
    _user.fetchFromCookie(function(u) {
      that.setState({user: u});
      if (u.hasAuthenticated() === false) {
        window.location = "signin.html#"+that.state.scenarioId;
      } else {
        // Icky - should be rendered
        $(".user-profile-info").html(u.fullname);
      }
    });
  },

  render: function () {
    return (
      <div className="user-view">
        <ScenarioView user={this.state.user} scenarioId={Session.scenarioId} ></ScenarioView>
      </div>
    );
  }
});

// ScenarioView
var ScenarioView = React.createClass({

  getInitialState: function () {
    var s = new Scenario();
    return { scenarioName: "", scenario: s };
  },

  userCreatedScenario: function () {
    return (this.state.scenario.wasCreatedBy(this.props.user));
  },

  handleScenarioName: function(e) {
    if (this.state.scenario.isNew() || this.userCreatedScenario()) {
      this.setState({scenarioName: e.target.value});
    } else {
      // TODO: move this into the render?
      App.errorMessage("Sorry, only the owner can edit the scenario.");
    }
  },

  hasValidationErrors: function () {
    if (this.props.user.hasAuthenticated() === false) {
      return App.errorMessage("You must be signed in to create a scenario.");
    }
    if (!this.state.scenarioName) {
      return App.errorMessage("Please provide a scenario name.");
    }
    return false;
  },

  saveScenario: function () {
    var that = this;

    this.state.scenario.user =  this.props.user;
    // TODO: bind directly to state.scenario.name (not this.state.scenarioName)
    this.state.scenario.name = this.state.scenarioName;
    this.state.scenario.save(function() {
      prompt("Copy and paste this link to play with others", that.state.scenario.shareableLink());
      window.location.href = that.state.scenario.shareableLink(true);
    });
  },

  updateScenario: function () {
    this.state.scenario.name = this.state.scenarioName;
    this.state.scenario.update(function (doc) {
      App.infoMessage("Scenario updated.");
    });
  },

  // TODO: consider moving this out to App
  handleScenarioSubmit: function(e) {
    e.preventDefault();
    // TODO: move this into the render
    if (this.hasValidationErrors() === true) { return; }

    if (this.state.scenario.isNew() === true) {
      this.saveScenario()
    } else {
      if (this.userCreatedScenario()) {
        this.updateScenario();
      }
    }
  },

  componentDidMount: function() {
    this.fetchScenario();
  },

  // TODO: consider moving this out Scenario
  fetchScenario: function () {
    var that = this;
    var _scenario = new Scenario();
    // Fetch the scenario given a query string
    if (this.props.scenarioId) {
      _scenario.get(this.props.scenarioId, function (s) {

        if (s.error) {
          App.errorMessage("Scenario was not found.");
        } else {
          that.setState({scenario: s});
          that.setState({scenarioName: s.name});
          that.setState({votes: s.votes});
        }
      });
    }
  },

  showCreateButton: function () {
    // Is the IF statement here is wrong - should render based on state?
    if (this.state.scenario.isNew() === true) {
      return (<span><br/><input className="save-button" onClick={this.handleScenarioSubmit} type="submit" value="Create New Scenario"/></span>)
    } else {
      return;
    }
  },

  toggleAllVotes: function (argument) {
    var labelText = "Hide";
    this.fetchScenario();

    if (this.areVotesVisible === true) {
      this.areVotesVisible = false;
      labelText = "Show";
    } else {
      this.areVotesVisible = true;
    }
    $("#all-votes").toggle();

    // TODO: move this in render
    $("#toggle-cards-button").text(labelText +" all Cards");
  },

  showVoting: function () {
    if (this.state.scenario.isNew() === false) {
      return (
        <div>
          <CastVoteView user={this.props.user} scenario={this.state.scenario} onVoteSubmit={this.fetchScenario}/>
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
     if (this.state.votes) {
      for (var i = 0; i < this.state.votes.length; i++) {
        var vote = this.state.votes[i];
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
var CastVoteView = React.createClass({

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

    if (!vote_value || typeof this.props.user === "undefined") { return; }

    // TODO: remove these if statements -
    if (this.props.user.vote(this.props.scenario, vote_value, this.props.onVoteSubmit) === false) {
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

ReactDOM.render(<UserView />, document.getElementById('react-container'));
