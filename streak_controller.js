//          DONE LIST:
//          - find or create streak for a user
//          - handle new streak creation
//          - handle existing streak lookup
//          - check to see whether the streak needs to be reset
//          - reset a streak
//          - update a streak when a new day is clicked
//          - update max streak (or not)
//          - refactor higher-level functionality into a streak_controller module
//          - refactor so maybeResetStreak doesn't need to be exported

//          TODO LIST:
//          - write test suite to verify endpoints

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
    db.insertStreak(new_streak, callback);
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
    db.saveStreak(streak);
}

// params: int, function
function getStreak(user_id, callback) {
    db.findStreak(user_id, function(streak) {
        if (streak) {
            maybeResetStreak(streak);
            callback(streak);
        } else {
            console.log("Unrecognized id : " + user_id);
        }
    });
}

// params: int
function incrementStreak(user_id) {
    console.log("incrementing streak " + user_id);
    db.findStreak(user_id, function(streak) {
        if (streak) {
            reset = maybeResetStreak(streak); // make sure streak is still valid
            if (!reset) {
                streak.streak_count = streak.streak_count + 1;
                if (shouldUpdateMaxStreak(streak)) {
                    streak.max_streak = streak.streak_count;
                }
                db.saveStreak(streak);
            }
        } else {
            addStreak(function(streak) {
                console.log("new streak with id = " + streak._id);
            });
        }
    });
}

// params: streak
// return: bool
function shouldUpdateMaxStreak(streak) {
    return (streak.streak_count > streak.max_streak);
}


exports.getStreak = getStreak;
exports.incrementStreak = incrementStreak;
