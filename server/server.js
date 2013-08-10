var http    = require('http');
var connect = require('connect');
var url     = require('url');
var router  = require("./router");

var asset_path = '../public/';

var requestHandler = connect()
    .use(connect.favicon(asset_path + 'favicon.ico'))
    .use(connect.static(asset_path))
    .use(function(request, response){
      var pathname = url.parse(request.url).pathname;

      data = router.route(pathname, function(success, data, content_type) {
          if (success) {
              response.writeHead(200, { 'Content-Type' : content_type });
              response.write(data);
              response.end();
          } else {
              response.writeHead(500, { 'Content-Type' : content_type });
              response.write(data);
              response.end();
          }
      });
    });

function start() {
    http.createServer(requestHandler).listen(1337, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:1337/');
}

exports.start = start;
exports.asset_path = asset_path;
