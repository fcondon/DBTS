var time_util = require("./lib/time_util");
var db = require("./lib/db");


/* Defines the data model for a streak object */

// params: int
function streak(user_id) {
    this.user_id = user_id;
    this.date = time_util.getStorableDate(new Date());
    this.streak_count = 0;
    this.max_streak = 0;
}


/* Functions for creating and storing a streak object */

// params: function
function createStreak(user_id, callback) {
    if (!parseInt(user_id)) {
        user_id = createID();
    }
    addStreakForUserID(user_id, callback);
}

// return: int
function createID() {
    return 1; //TODO: generate a memorable id hash
}

// params: int, function
function addStreakForUserID(user_id, callback) {
    db.findStreak(user_id, function(existing_streak) {
        if (existing_streak) {
            console.log("Tried to add duplicate streak for user_id " + user_id);
            callback(existing_streak);
        } else {
            var new_streak = new streak(user_id);
            db.insertStreak(new_streak, callback);
            callback(new_streak);
        }
    });
}


/* Defines the getter for a streak object */

// params: int, function
function getStreak(user_id, callback) {
    db.findStreak(user_id, function(streak) {
        if (streak) {
            maybeResetStreak(streak);
        } else {
            console.log("Unrecognized id : " + user_id);
        }
        callback(streak);
    });
}


/* Functions for updating existing streaks */

// params: int
function updateOrCreateStreak(user_id, callback) {
    db.findStreak(user_id, function(streak) {
        if (streak) {
            reset = maybeResetStreak(streak);   // make sure streak is still valid
            if (!reset) {
                if (shouldIncrement(streak)) {
                    incrementStreak(streak);
                }
            }
            callback(streak);
        } else {
            addStreakForUserID(user_id, function(streak) {
                console.log("New streak with id = " + streak.user_id + " created");
                callback(streak);
            });
        }
    });
}

// params: streak
// return: bool
function shouldIncrement(streak) {
    if (streak.date) {
        last_day = time_util.getLastStreakDate(streak.date, streak.streak_count);
        today = new Date();
        if (time_util.compareDates(today, last_day) >= 0) {
            return true;
        }
    }
    return false;
}

// params: streak
function incrementStreak(streak) {
    streak.streak_count = streak.streak_count + 1;
    maybeUpdateMaxStreak(streak);
    db.saveStreak(streak);
}

// params: streak
// return: bool
function maybeUpdateMaxStreak(streak) {
    if (streak.streak_count > streak.max_streak) {
        streak.max_streak = streak.streak_count;
    }
}

// params: streak
// return: bool
function maybeResetStreak(streak) {
    if (streak.date) {
        last_day = time_util.getLastStreakDate(streak.date, streak.streak_count);
        yesterday = time_util.getYesterday(new Date());
        console.log("Loaded %s, last good streak day = ", streak.user_id, last_day);
        if (time_util.compareDates(yesterday, last_day) >= 0) {
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


exports.createStreak = createStreak;
exports.getStreak = getStreak;
exports.updateOrCreateStreak = updateOrCreateStreak;
