window.Scenario =  function Scenario(options) {
  if (options) {
    this.name = options.name;
    this.user = options.user;    
  }
}

Scenario.prototype.save = function () {
  var that = this;

  Db.Scenarios.info().then(function (result) {
    that.id = result.update_seq + ":" + Date.now().toString();
    Db.Scenarios.put({
      _id: that.id,
      name: that.name,
      user: that.user    
    }).then(function(doc) {
      that.id = doc.id;
      that.rev = doc.rev;      
    });
  })
  .catch(function (err) {
    console.log(err);
  });

  return this;
};

Scenario.prototype.get = function (id, callback) {
  var that = this;
  Db.Scenarios.get(id).then(function (doc) {
    that._rev = doc._rev;
    that.id = doc._id;
    that.name = doc.name;
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