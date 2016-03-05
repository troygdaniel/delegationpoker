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

// TODO: Consider placing below methods in a more appropriate place (Scenario?)
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

App.clearInfo = function() {
  console.log("clearInfo");
  $("#info-message").removeAttr('style');
}
