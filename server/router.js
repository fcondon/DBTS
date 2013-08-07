var streak_controller   = require("./streak_controller");

var root = "/";
var icon = "/favicon.ico";

function route(path, callback) {
    var data = null;

    path = path.substr(1); // trim first slash
    var path_elements = path.split('/');
    var action = path_elements.shift();
    var user_id = parseInt(path_elements.shift());

    switch (action) {
        case "get":
            if (user_id) {
                streak_controller.getStreak(user_id, function(record) {
                    if (record) {
                        logStreak(record);
                        callback(JSON.stringify(record));
                    }
                });
            } else {
                console.log("Streak for id " + user_id + " not found");
            }
            break;
        case "new":
            streak_controller.createStreak(function(streak) {
                data = (streak) ? "success" : "failure"; // TODO: stub
                callback(data);
            });
            break;
        case "update":
            streak_controller.incrementOrCreateStreak(user_id);
            data = "success"; // TODO: stub
        default:
            callback(data);
    }
}

function logStreak(record) {
    console.log("Streak = " + record.streak_count);
}

exports.route = route;
