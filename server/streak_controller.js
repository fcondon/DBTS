var time_util = require("./lib/time_util");
var db = require("./lib/db");

function streak(user_id) {
    this.user_id = user_id;
    this.date = null;
    this.streak_count = 0;
    this.max_streak = 0;
}

// params: int, function
function addStreak(user_id, callback) {
    var new_streak = new streak(user_id);
    console.log("new streak: ", new_streak);
    db.insertStreak(new_streak, callback);
    callback(new_streak);
}

// params: streak
// return: bool
function maybeResetStreak(streak) {
    if (streak.date) {
        last_day = time_util.getLastStreakDate(streak.date, streak.streak_count);
        yesterday = time_util.getYesterday(new Date());
        console.log("loaded %s, last good streak day = ", streak.user_id, last_day);
        if (time_util.compareDates(yesterday, last_day) > 0) {
            resetStreak(streak);
            return true;
        }
    }
    return false;
}

// params: streak
function resetStreak(streak) {
    console.log("Resetting streak " + streak.user_id);
    streak.date = null;
    streak.streak_count = 0;
    db.saveStreak(streak);
}

// params: int, function
function getStreak(user_id, callback) {
    db.findStreak(user_id, function(streak) {
        if (!streak) {
            console.log("Unrecognized id : " + user_id);
        }
        callback(streak);
    });
}

// params: int
function incrementOrCreateStreak(user_id) {
    console.log("incrementing streak " + user_id);
    db.findStreak(user_id, function(streak) {
        if (streak) {
            reset = maybeResetStreak(streak); // make sure streak is still valid
            if (!reset) {
                streak.streak_count = streak.streak_count + 1;
                maybeUpdateMaxStreak(streak);
                db.saveStreak(streak);
            }
        } else {
            addStreak(user_id, function(streak) {
                console.log("new streak with id = " + streak.user_id + " created");
            });
        }
    });
}

// params: streak
// return: bool
function maybeUpdateMaxStreak(streak) {
    if (streak.streak_count > streak.max_streak) {
        streak.max_streak = streak.streak_count;
    }
}


exports.getStreak = getStreak;
exports.maybeUpdateMaxStreak = maybeUpdateMaxStreak;
exports.incrementOrCreateStreak = incrementOrCreateStreak;
