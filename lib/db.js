var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
var db_path = 'mongodb://127.0.0.1:27017/streakdb';

var streak_collection = 'streak_counts';

// params: function
function connect(callback) {
    MongoClient.connect(db_path, function(err, db) {
        if (err) throw err;
        callback(db);
     });
}

exports.connect = connect;
exports.streak_collection = streak_collection;
