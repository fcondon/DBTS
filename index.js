var server = require("./server");
var router = require("./router");
var db = require("./db");

console.log("starting server");
server.start(router.route, db);
