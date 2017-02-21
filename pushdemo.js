var MongoClient = require('mongodb').MongoClient;
var GCM = require('gcm@1.0.1').GCM;

var sendPushToDeviceIds = function(db, message, callback) {
  var apiKey = 'AIzaSyDkBZAIkPsWCmLgLIJBDFtmJ7ZpGJ1ofTs';
  var gcm = new GCM(apiKey);
  
  db.collection('devices').find({}).toArray(function(err, results){
    
    results.forEach(function(value){
      
      if (value.deviceId !== null && typeof value.deviceId !== 'undefined') {
        console.log('Sending message %s to %s', message, value['deviceId']);
      
        var messageObject = {
            registration_id: value['deviceId'],
            'data.title': 'CloudMessageDemo',
            'data.message': message
        };

        gcm.send(messageObject, function(err, messageId){
            if (!err) {
                console.log("Sent! %s", messageId);
            }
        });
        
      }
      
    });
    
    callback(err);
  });
}

module.exports = function (ctx, done) {
  
  MongoClient.connect(ctx.data.MONGO_URL, function (err, db) {
    if(err) return done(err);
    
    var message = ctx.data.message
    console.log('Sending message %s', message);
  
    sendPushToDeviceIds(db, message, function(err) {
      db.close();
      done(null);
    });
    
  });
  
}
