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
