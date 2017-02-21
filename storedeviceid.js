var parallel    = require('async').parallel;
var MongoClient = require('mongodb').MongoClient;

var saveDeviceId = function(db, deviceId, callback) {
  db.collection('devices')
    .update(
      {"deviceId" : deviceId }, 
      {"deviceId" : deviceId }, 
      { upsert: true }, 
      function(err, result) {
        console.log('Successfully saved %s', deviceId);
        callback(err);
      });
}

module.exports = function (ctx, done) {
  var deviceId = ctx.data.deviceId
  console.log('DeviceId %s', deviceId);
  
  MongoClient.connect(ctx.data.MONGO_URL, function (err, db) {
    if(err) return done(err);
  
    saveDeviceId(db, deviceId, function(err) {
      db.close();
      done(null);
    });

  });
  
}

