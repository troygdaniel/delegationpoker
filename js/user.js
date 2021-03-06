window.User =  function User(options){
  this._hasAuthenticated = false;
  if (options) {
    if (options.username) this.username = options.username;
    if (options.fullname) this.fullname = options.fullname;
  }
};

User.prototype.vote = function (scenario, _cardValue, onSuccess) {
  if (this.hasAuthenticated() === true) {
    return new Vote({user:this, scenario:scenario, cardValue: _cardValue}, onSuccess);
  } else {
    return false;
  }
}

User.prototype.register = function(password, onSuccess, onFailure) {
  var that = this;

  Db.Users.put({
    _id: CryptoJS.SHA256(that.username).toString(),
    username: that.username,
    password: CryptoJS.SHA256(password).toString(),
    fullname: that.fullname

  }).then(function (doc) {
    that.id = doc.id;
    that.rev = doc.rev;
    that._hasAuthenticated = true;
    that.setCookie(that.username, password);

    if (onSuccess) onSuccess(doc);
  }).catch(onFailure);


};

// TODO: Revise key of auth endpoint to recieve uid:pass
// Unable to make this change until auth endpoint is limited to query string GET's
User.prototype.signon = function(password, callback) {
  var that = this;
  var endpoint = AUTH_END_POINT + "%22" + CryptoJS.SHA256(password).toString()+"%22";
  $.getJSON(endpoint, function( results ) {
    if (that.didFindMatchingUser(results)) {
      that.setCookie(that.username, password);
      if (callback) callback(that);
    } else {
      if (callback) callback(that);
    }
  });

};

User.prototype.setCookie = function (uid, pwd) {
  Cookies.set('username', uid, { expires: 365 });
  Cookies.set('password', pwd, { expires: 365 });
}

User.prototype.fetchFromCookie = function (callback) {
  var pwd = Cookies.get('password');
  this.username = Cookies.get('username');
  this.signon(pwd, callback);
}

User.prototype.hasAuthenticated = function () {
  return this._hasAuthenticated;
}

User.prototype.didFindMatchingUser = function (results) {
  this._hasAuthenticated = false;

  for (indx in results.rows) {
    var row = results.rows[indx];
    var uname = row.value.username;

    if (uname === this.username) {
      this.username = uname;
      this.id = row.id;
      this.rev = row.value.rev;
      this.fullname = row.value.fullname;
      this._hasAuthenticated = true;
    }
  }
  return this._hasAuthenticated;
}

User.prototype.remove = function () {
  return Db.Users.remove(this.id, this.rev);
}
