var http = require('http');
var url = require('url');

function start(route) {
    http.createServer(function (request, response) {
      var pathname = url.parse(request.url).pathname;

      route(pathname);

      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    }).listen(1337, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:1337/');
}
exports.start = start;
