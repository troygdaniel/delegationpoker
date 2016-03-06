var DEVELOPMENT_MODE = false;
configurePersistence(DEVELOPMENT_MODE);

function configurePersistence(DEVELOPMENT_MODE) {
  var couchDBServer = "https://troygdaniel.cloudant.com";

  if (DEVELOPMENT_MODE === true) couchDBServer = "http://localhost:5984";

  window.Session = {};
  window.Db = {}
  window.Db.Users = {};
  window.Db.Scenarios = {};
  window.Db.Votes = {};

  window.Db.Users = new PouchDB(couchDBServer+"/users");
  window.Db.Scenarios = new PouchDB(couchDBServer+"/scenarios");
  window.Db.Votes = new PouchDB(couchDBServer+"/votes");
  window.AUTH_END_POINT = couchDBServer+"/users/_design/1/_view/auth?key=";
  window.VOTES_END_POINT = couchDBServer+"/votes/_design/1/_view/scenarios?key=";

}

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
