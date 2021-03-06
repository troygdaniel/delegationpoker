window.Scenario =  function Scenario(options) {
  if (options) {
    this.name = options.name;
    this.user = options.user;
  }
};

Scenario.prototype.save = function (callback) {
  var that = this;

  Db.Scenarios.info().then(function (result) {
    that.id = result.update_seq + ":" + Date.now().toString();
    Db.Scenarios.put({
      _id: that.id,
      _rev: that.rev,
      name: that.name,
      user: that.user
    }).then(function(doc) {
      that.id = doc.id;
      that.rev = doc.rev;
      if (callback) { callback(doc); }
    });
  })
  .catch(function (err) {
    console.log(err);
    if (callback) { callback(err); }
  });

  return this;
};

Scenario.prototype.update = function (callback) {
  var that = this;

  Db.Scenarios.put({
    _id: that.id,
    _rev: that.rev,
    name: that.name,
    user: that.user
  }).then(function(doc) {
    that.id = doc.id;
    that.rev = doc.rev;
    if (callback) { callback(doc); }
  });

  return this;
};

Scenario.prototype.get = function (id, callback) {
  var that = this;
  Db.Scenarios.get(id).then(function (doc) {
    that.rev = doc._rev;
    that.id = doc._id;
    that.name = doc.name;
    that.user = doc.user;

    $.getJSON(VOTES_END_POINT +"%22"+that.id+"%22", function( results ) {
      that.votes = results.rows;
      if (callback) callback(that);
    });

  }).catch(function (err) {
    if (callback) { callback(err); }
  });
};

Scenario.prototype.shareableLink = function (shouldReload) {
  var baseURL = window.location.href;
  if (baseURL.slice(-1) === "#") {
    baseURL = baseURL.substr(0,baseURL.length-1);
  }
  if (shouldReload === true) {
    return baseURL+"?reload="+Date.now()+"#"+this.id;
  } else {
    return baseURL+"#"+this.id;
  }
};

Scenario.prototype.remove = function () {
  return Db.Scenarios.remove(this.id, this.rev);
};

Scenario.prototype.isNew = function () {
  return (typeof this.rev === "undefined");
};

Scenario.prototype.wasCreatedBy = function (user) {
  if (user && this.user) {
    return (user.username === this.user.username);
  } else {
    return false;
  }
};
