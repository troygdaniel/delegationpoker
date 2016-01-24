window.User =  function User(options){
  this.username = options.username;
  this.fullname = options.fullname;
  
};

User.prototype.vote = function (scenario, _cardValue) {
  return new Vote({user:this, scenario:scenario, cardValue: _cardValue});
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

    if (onSuccess) onSuccess(doc);
  }).catch(onFailure);  
};

// TODO: Revise key of auth endpoint to recieve uid:pass
// Unable to make this change until auth endpoint is limited to query string GET's
User.prototype.signon = function(password, onSuccess, onFailure) {
  var that = this;
  var endpoint = AUTH_END_POINT + "%22" + CryptoJS.SHA256(password).toString()+"%22";

  $.getJSON(endpoint, function( results ) {
    
    for (indx in results.rows) {
      var row = results.rows[indx];
      var uname = row.value.username;

      if (uname === that.username) {
        that.username = uname;
        that.id = row.id;
        that.rev = row.value.rev;
        that.fullname = row.value.fullname;

        if (onSuccess)  { onSuccess(); return;}
      }
    }
    if (onFailure) { onFailure(); return;}
  });

};

User.prototype.remove = function () {
  return Db.Users.remove(this.id, this.rev);
}