var streak_controller = require("./streak_controller");

var root = "/";
var icon = "/favicon.ico";

function route(pathname) {
    switch (pathname) {
        case icon:
            console.log("Should serve favicon");
            break;
        case root:
            console.log("Should generate a user id");
            break;
        default:
            var user_id = parseInt(pathname.substring(1));
            var record = streak_controller.findOrCreateStreak(user_id, function(record) {
                logStreak(record);
            });
    }
}

function logStreak(record) {
    console.log("streak = " + record.streak_count);
    streak_controller.maybeResetStreak(record);
}

exports.route = route;
