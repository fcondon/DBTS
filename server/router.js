var streak_controller = require("./streak_controller");

var root = "/";
var icon = "/favicon.ico";

function route(pathname) {
    switch (pathname) {
        default:
            var user_id = parseInt(pathname.substring(1));
            if (user_id) {
                streak_controller.getStreak(user_id, function(record) {
                    if (record) {
                        streak_controller.maybeResetStreak(streak);
                        logStreak(record);
                    }
                    streak_controller.incrementOrCreateStreak(user_id);
                });
            } else {
                console.log("path = " + pathname);
                console.log("Should generate user id");
            }
    }
}

function logStreak(record) {
    console.log("streak = " + record.streak_count);
}

exports.route = route;
