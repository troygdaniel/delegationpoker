window.Vote =  function Vote(options, onSuccess) {
  this.user = options.user;
  this.scenario = options.scenario;
  this.cardValue = options.cardValue;
  
  var that = this;
  this.createOrFindVote(function () {
      that.save(that.cardValue);
  });

}

Vote.prototype.createOrFindVote = function (callback) {

  var that = this;
  // Was a vote already cast?
  Db.Votes.get(this.user.username + ":" + this.scenario.id).then(function (doc) {
    that._rev = doc._rev;
    callback();    
  }).catch(function (err) {
    callback();          
  });
}

Vote.prototype.save = function (cardValue) {
  var that = this;

  Db.Votes.put({
    
    _id: that.user.username + ":" + that.scenario.id,
    _rev: that._rev,
    card_value: cardValue,
    scenario: that.scenario,
    user: that.user,

  }).then(function (response) {
    that.rev = response.rev;
    that.id = response.id;

  }).catch(function (err) {
    console.log(err);
  });

  return this;
};

Vote.prototype.remove = function () {
  return Db.Votes.remove(this.id, this.rev);
}