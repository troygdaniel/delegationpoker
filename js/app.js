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


window.App.init = function () {
  if (location.search) {
    var queryString = location.search.substr(1, location.search.length);
    if (queryString) {
      Session.scenario = new Scenario();
      Session.scenarioId = queryString;
     
      Session.user = new User();
      // Fetch the user using the cookie information
      Session.user.fetchFromCookie(function() {
        // Session.UserView.setUser(Session.user);
        // Session.UserView.render();
        // Fetch the scenario given a query string
        Session.scenario.get(queryString, function (doc) {
          if (doc.error) { console.error("Scenario '"+queryString+"' not found."); } 
        });
      });
    }
  }
}
