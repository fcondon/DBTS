//          DONE LIST:
//          - find or create streak for a user
//          - handle new streak creation
//          - handle existing streak lookup
//          - check to see whether the streak needs to be reset
//          - reset a streak
//          - update a streak when a new day is clicked
//          - update max streak (or not)
//          - refactor higher-level functionality into a streak_controller module

//          TODO LIST:
//          - refactor so maybeResetStreak doesn't need to be exported
//          - write test suite to verify endpoints
//          - add documentation of how the endpoints work

var time_util = require("./lib/time_util");
var db = require("./lib/db");

function streak(user_id) {
    this._id = user_id;
    this.date = null;
    this.streak_count = 0;
    this.max_streak = 0;
}

// params: int, function
function addStreak(user_id, callback) {
    var new_streak = new streak(user_id); // TODO: wait for user input to create
    console.log("new streak: ", new_streak);
    insertStreak(new_streak, callback);
}

// params: int, function
function findStreak(user_id, callback) {
    db.connect(function(db_connection) {
        var collection = db_connection.collection(db.streak_collection);
        var cursor = collection.find({ "_id" : user_id }).nextObject(function(err, streak) {
            if (err) throw err;
            if (callback) {
                callback(streak);
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
    db.connect(function(db_connection) {
        var collection = db_connection.collection(db.streak_collection);
        collection.save(streak, function(err, streak) {
            if (err) throw err;
        });
        db_connection.close();
    });
}

// params: int, function
function findOrCreateStreak(user_id, callback) {
    findStreak(user_id, function(streak) {
        if (streak) {
            maybeResetStreak(streak);
            callback(streak);
        } else {
            addStreak(user_id, function(streak) {
                callback(streak);
            });
        }
    });
}

function updateStreak(user_id) {
    findStreak(user_id, function(streak) {
        if (streak) {
            reset = maybeResetStreak(streak); // make sure streak is still valid
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
function insertStreak(insertion_data, callback) {
    db.connect(function(db_connection) {
        var collection = db_connection.collection(db.streak_collection);
        collection.insert(insertion_data, function(err, streaks) {
            if (err) throw err;
            if (callback) {
                callback(streaks[0]);
            }
        });
        db_connection.close();
    });
}

exports.findOrCreateStreak = findOrCreateStreak;
exports.updateStreak = updateStreak;
