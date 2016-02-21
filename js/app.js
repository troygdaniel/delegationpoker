window.App = {};
window.Session = {};
window.Db = {}
window.Db.Users = {};
window.Db.Scenarios = {};
window.Db.Votes = {};

window.Db.Users = new PouchDB('http://localhost:5984/users');
window.Db.Scenarios = new PouchDB('http://localhost:5984/scenarios');
window.Db.Votes = new PouchDB('http://localhost:5984/votes');
window.AUTH_END_POINT = "http://localhost:5984/users/_design/1/_view/auth?key=";
window.VOTES_END_POINT = "http://localhost:5984/votes/_design/1/_view/scenarios?key=";


Session.scenario = new Scenario();
Session.user = new User();

// Grab the Scenario ID from the query string
if (window.location.hash.substr(1)) {
  var hashId = window.location.hash.substr(1);
  if (hashId) {
    Session.scenarioId = hashId;
  }
}
console.log("location.href = " + hashId);

function infoMessage (t) {
  $("#info-message").css('color','blue');
  setMessage(t);
}
function errorMessage (t) {
  $("#info-message").css('color','red');
  setMessage(t);
}
function setMessage (t) {
  $("#info-message").text(t);
  setTimeout(clearInfo,1200);
}

function clearInfo() {
  console.log("clearInfo");
  $("#info-message").removeAttr('style');
}
