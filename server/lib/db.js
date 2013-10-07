var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
var db_path = 'mongodb://127.0.0.1:27017/streakdb';

var streak_collection = 'streak_counts';
var retries = 3;

// params: function
function connect(callback, tries) {
    if (tries < retries) {
        MongoClient.connect(db_path, function(err, db) {
            // don't start no shit, won't be no shit
            if (err) {
                handleDBError(err, callback, tries);
            } else {
                callback(db);
            }
        });
    } else {
        throw "Could not connect to DB";
    }
}

function handleDBError(err, callback, tries) {
    console.log("DB connection error: %s (%d tries)", err, tries);

    // retry
    tries++;
    connect(callback, handleDBError, tries);
}

// params: int, function
function findStreak(user_id, callback) {
    console.log('finding ' + user_id);
    connect(function(db_connection) {
        var collection = db_connection.collection(streak_collection);
        var cursor = collection.find({ "user_id" : user_id }).nextObject(function(err, streak) {
            if (err) throw err;
            if (callback) {
                callback(streak);
            }
        });
    }, 1);
}

// params: streak
function saveStreak(streak) {
    connect(function(db_connection) {
        var collection = db_connection.collection(streak_collection);
        collection.save(streak, function(err, streak) {
            if (err) throw err;
        });
        db_connection.close();
    }, 1);
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
    }, 1);
}

exports.findStreak = findStreak;
exports.saveStreak = saveStreak;
exports.insertStreak = insertStreak;
