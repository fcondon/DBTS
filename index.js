var server = require("./server");
var router = require("./router");

console.log("starting server");
server.start(router.route);
