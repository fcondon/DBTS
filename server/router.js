var streak_controller   = require("./streak_controller");
var server              = require("./server");
var fs                  = require('fs');

var root = "/";
var icon = "/favicon.ico";

var content_type_html = 'text/html';
var content_type_plain = 'text/plain';


function route(path, callback) {
    var data = null;
    var success = false;

    path = path.substr(1); // trim first slash
    var path_elements = path.split('/');
    var action = path_elements.shift();
    var user_id = path_elements.shift();

    switch (action) {
        case "get":
            // get the streak data
            if (user_id) {
                streak_controller.getStreak(user_id, function(record) {
                    if (record) {
                        success = true;
                    }
                    callback(success, JSON.stringify(record), content_type_plain);
                });
            } else {
                console.log("Streak for id " + user_id + " not found");
                callback(false, data, content_type_plain);
            }
            break;
        case "new":
            // create a new streak with a generated user id
            streak_controller.createStreak(user_id, function(streak) {
                success = (streak != null);
                callback(success, JSON.stringify(streak), content_type_plain);
            });
            break;
        case "update":
            // update or create the streak with this user id
            streak_controller.updateOrCreateStreak(user_id, function(streak) {
                success = (streak != null);
                callback(success, JSON.stringify(streak), content_type_plain);
            });
            break;
        default:
            // serve HTML
            fs.readFile(server.asset_path + 'index.html', function(err, file_contents) {
                if (err) throw err;

                data = file_contents;
                callback(true, file_contents, content_type_html);
            });
    }
}

exports.route = route;
