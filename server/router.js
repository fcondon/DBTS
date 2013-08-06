var streak_controller = require("./streak_controller");

var root = "/";
var icon = "/favicon.ico";

function route(path) {
    var path_elements = pathname.split('/');
    if (path_elements.length > 1) {
        var action = path_elements.shift();
        var user_id = parseInt(pathname.shift());
        console.log("Action = " + action + ", id = " + user_id);
        switch (action) {
            case "get":
                if (user_id) {
                    streak_controller.getStreak(user_id, function(record) {
                        if (record) {
                            // TODO: dump streak data for consumption
                            logStreak(record);
                        }
                    });
                } else {
                    console.log("Streak for id " + user_id + " not found");
                }
            case "update":
                streak_controller.incrementOrCreateStreak(user_id);
            case "new":
                streak_controller.createStreak();
            default:
                console.log("Unrecognized command: " + action);
        }
    }
}

function logStreak(record) {
    console.log("streak = " + record.streak_count);
}

exports.route = route;
