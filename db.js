//          DONE LIST:
//          - find or create streak for a user
//          - handle new streak creation
//          - handle existing streak lookup

//          TODO LIST:
//          - check to see whether the streak needs to be reset
//          - update a streak when a new day is clicked
//          - update max streak (or not)
//          - reset a streak

var time_util = require("./time_util");

function streak(user_id) {
    var current_date = new Date();

    this.user_id = user_id;
    this.date = time_util.getDate(current_date);
    this.streak_count = 0;
    this.max_streak = 0;
}

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
var db_path = 'mongodb://127.0.0.1:27017/streakdb';

function log(path) {
    var access_record = {'request' : path};
    insert('access_logs', access_record);
}

function addStreak(user_id, callback) {
    var new_streak = new streak(user_id);
    console.log("new streak: %o", new_streak);
    insert('streak_counts', new_streak, callback);
}

function findStreak(user_id, callback) {
    MongoClient.connect(db_path, function(err, db) {
        if (err) throw err;

        var collection = db.collection('streak_counts');
        var cursor = collection.find({ "user_id" : user_id }).nextObject(function(err, doc) {
            if (err) throw err;
            if (callback) {
                callback(doc);
            }
        });
    });
}

function maybeResetStreak(streak) {
    last_day = time_util.getLastStreakDate(streak.date, streak.streak_count);
    console.log("loaded %s, last good streak day = %o", streak.user_id, last_day);
    // TODO: do something real
}

function findOrCreateStreak(user_id, callback) {
    findStreak(user_id, function(doc) {
        if (doc) {
            callback(doc);
        } else {
            addStreak(user_id, function(doc) {
                callback(doc);
            });
        }
    });
}

function insert(collection_name, insertion_data, callback) {
    MongoClient.connect(db_path, function(err, db) {
        if (err) throw err;

         var collection = db.collection(collection_name);
         collection.insert(insertion_data, function(err, docs) {
            if (err) throw err;
            if (callback) {
                callback(docs[0]);
            }
            db.close();
         });
    });
}

exports.addStreak = addStreak;
exports.findOrCreateStreak = findOrCreateStreak;
exports.maybeResetStreak = maybeResetStreak;
exports.log = log;
