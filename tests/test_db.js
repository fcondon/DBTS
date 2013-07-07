var assert = require('assert');
var time_util = require("server/lib/db");

test_addStreak();

function test_addStreak() {
    db.addStreak('1', function(doc) {
        console.log(doc);
    });
};
