window.Scenario =  function Scenario(options) {
  if (options) {
    this.name = options.name;
    this.user = options.user;    
  }
}

Scenario.prototype.save = function (callback) {
  var that = this;

  Db.Scenarios.info().then(function (result) {
    // debugger 
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
    if (callback) { callback(doc); }

  }).catch(function (err) {
    if (callback) { callback(err); }
  });
}

Scenario.prototype.allVotes = function(callback) {
  $.getJSON(VOTES_END_POINT +"%22"+this.id+"%22", function( results ) {
    if (callback) callback(results);
  });
};

Scenario.prototype.shareableLink = function() {
};

Scenario.prototype.remove = function () {
  return Db.Scenarios.remove(this.id, this.rev);
}