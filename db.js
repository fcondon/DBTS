//          DONE LIST:
//          - find or create streak for a user
//          - handle new streak creation
//          - handle existing streak lookup
//          - check to see whether the streak needs to be reset
//          - reset a streak
//          - update a streak when a new day is clicked
//          - update max streak (or not)

//          TODO LIST:
//          - write test suite to verify endpoints
//          - refactor so maybeResetStreak doesn't need to be exported
//          - add documentation of how the endpoints work

var time_util = require("./lib/time_util");

function streak(user_id) {
    this._id = user_id;
    this.date = null;
    this.streak_count = 0;
    this.max_streak = 0;
}

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
var db_path = 'mongodb://127.0.0.1:27017/streakdb';

// params: string
function log(path) {
    var access_record = {'request' : path};
    insert('access_logs', access_record);
}

// params: int, function
function addStreak(user_id, callback) {
    var new_streak = new streak(user_id); // TODO: wait for user input to create
    console.log("new streak: %o", new_streak);
    insert('streak_counts', new_streak, callback);
}

// params: int, function
function findStreak(user_id, callback) {
    dbConnect(function(db) {
        var collection = db.collection('streak_counts');
        var cursor = collection.find({ "_id" : user_id }).nextObject(function(err, doc) {
            if (err) throw err;
            if (callback) {
                callback(doc);
            }
        });
    });
}

// params: streak
// return: bool
function maybeResetStreak(streak) {
    if (streak.date) {
        last_day = time_util.getLastStreakDate(streak.date, streak.streak_count);
        yesterday = time_util.getYesterday(new Date());
        console.log("loaded %s, last good streak day = ", streak._id, last_day);
        if (time_util.compareDates(yesterday, last_day) > 0) {
            resetStreak(streak);
            return true;
        }
    }
    return false;
}

// params: streak
function resetStreak(streak) {
    console.log("Resetting streak " + streak._id);
    streak.date = null;
    streak.streak_count = 0;
    saveStreak(streak);
}

// params: streak
function saveStreak(streak) {
    dbConnect(function(db) {
        var collection = db.collection('streak_counts');
        collection.save(streak, function(err, doc) {
            if (err) throw err;
        });
        db.close();
    });
}

// params: int, function
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

function updateStreak(user_id) {
    findStreak(user_id, function(doc) {
        if (doc) {
            reset = maybeResetStreak(doc); // make sure streak is still valid
            if (!reset) {
                streak.streak_count = streak.streak_count + 1;
                if (shouldUpdateMaxStreak(streak)) {
                    streak.max_streak = streak.streak_count;
                }
                saveStreak(streak);
            }
        } else {
            throw "No streak associated with id " + user_id;
        }
    });
}

// params: streak
// return: bool
function shouldUpdateMaxStreak(streak) {
    return (streak.streak_count > streak.max_streak);
}


// params: string, object, function 
function insert(collection_name, insertion_data, callback) {
    dbConnect(function(db) {
        var collection = db.collection(collection_name);
        collection.insert(insertion_data, function(err, docs) {
            if (err) throw err;
            if (callback) {
                callback(docs[0]);
            }
        });
        db.close();
    });
}

// params: function
function dbConnect(callback) {
    MongoClient.connect(db_path, function(err, db) {
        if (err) throw err;
        callback(db);
     });
}

exports.findOrCreateStreak = findOrCreateStreak;
exports.updateStreak = updateStreak;
exports.maybeResetStreak = maybeResetStreak;
exports.log = log;
