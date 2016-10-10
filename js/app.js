var DEVELOPMENT_MODE = false;
configurePersistence(DEVELOPMENT_MODE);

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
};

App.errorMessage = function(t) {
  $("#info-message").css('color','red');
  App.setMessage(t);
  return true;
};

App.setMessage = function(t) {
  $("#info-message").text(t);
  setTimeout(App.clearInfo,1200);
};

App.clearInfo = function() {
  console.log("clearInfo");
  $("#info-message").removeAttr('style');
};
