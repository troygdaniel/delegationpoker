var pouchServer = "localhost";
window.Session = {};
window.Db = {}
window.Db.Users = {};
window.Db.Scenarios = {};
window.Db.Votes = {};

window.Db.Users = new PouchDB("http://"+pouchServer+":5984/users");
window.Db.Scenarios = new PouchDB("http://"+pouchServer+":5984/scenarios");
window.Db.Votes = new PouchDB("http://"+pouchServer+":5984/votes");
window.AUTH_END_POINT = "http://"+pouchServer+":5984/users/_design/1/_view/auth?key=";
window.VOTES_END_POINT = "http://"+pouchServer+":5984/votes/_design/1/_view/scenarios?key=";


Session.scenario = new Scenario();
Session.user = new User();
Session.scenarioId = "";

// Grab the Scenario ID from the query string
if (window.location.hash.substr(1)) {
  var hashId = window.location.hash.substr(1);
  if (hashId) {
    Session.scenarioId = hashId;
  }
}

window.App =  {};

App.shareableLink = function (shouldReload) {
  var baseURL = window.location.href;
  if (baseURL.slice(-1) === "#") {
    baseURL = baseURL.substr(0,baseURL.length-1);
  }
  if (shouldReload === true) {
    return baseURL+"?reload="+Date.now()+"#"+Session.scenario.id;
  } else {
    return baseURL+"#"+Session.scenario.id;
  }
}

// TODO: Consider placing below methods in a more appropraite place (Scenario?)
//        Possibly renaming App to AppUtil?
App.infoMessage = function(t) {
  $("#info-message").css('color','blue');
  App.setMessage(t);
}

App.errorMessage = function(t) {
  $("#info-message").css('color','red');
  App.setMessage(t);
  return true;
}

App.setMessage = function(t) {
  $("#info-message").text(t);
  setTimeout(App.clearInfo,1200);
}

App.userHasCreatedScenario = function () {
  return (Session.user.username === Session.scenario.user.username);
}

// TODO: Consider removing either Session or App
//       (redundancy with Session and App)
App.saveScenario = function (user, scenarioName) {
  Session.scenario = new Scenario({user: user, name: scenarioName});

  Session.scenario.save(function() {
    prompt("Copy and paste this link to play with others", App.shareableLink());
    window.location.href = App.shareableLink(true);
  });
}

App.updateScenario = function (scenarioName) {
  Session.scenario.name = scenarioName;
  Session.scenario.update(function (doc) {
    App.infoMessage("Scenario updated.");
  });
}

App.isNewScenario = function () {
  return (typeof Session.scenario.rev === "undefined");
}

App.clearInfo = function() {
  console.log("clearInfo");
  $("#info-message").removeAttr('style');
}
