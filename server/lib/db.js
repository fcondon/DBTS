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

// params: int, function
function findStreak(user_id, callback) {
    connect(function(db_connection) {
        var collection = db_connection.collection(streak_collection);
        var cursor = collection.find({ "_id" : user_id }).nextObject(function(err, streak) {
            if (err) throw err;
            if (callback) {
                callback(streak);
            }
        });
    });
}

// params: streak
function saveStreak(streak) {
    connect(function(db_connection) {
        var collection = db_connection.collection(streak_collection);
        collection.save(streak, function(err, streak) {
            if (err) throw err;
        });
        db_connection.close();
    });
}

// params: string, object, function
function insertStreak(insertion_data, callback) {
    connect(function(db_connection) {
        var collection = db_connection.collection(streak_collection);
        collection.insert(insertion_data, function(err, streaks) {
            if (err) throw err;
            if (callback) {
                callback(streaks[0]);
            }
        });
        db_connection.close();
    });
}

exports.findStreak = findStreak;
exports.saveStreak = saveStreak;
exports.insertStreak = insertStreak;
