var http    = require('http');
var connect = require('connect');
var url     = require('url');
var fs      = require('fs');
var router  = require("./router");

var asset_path = '../public/';

var requestHandler = connect()
    .use(connect.favicon(asset_path + 'favicon.ico'))
    .use(connect.static(asset_path))
    .use(function(request, response){
      var pathname = url.parse(request.url).pathname;

      data = router.route(pathname, function(data) {
          if (data) {
              console.log("Path = " + pathname + ", Serving API response");
              response.writeHead(200, {'Content-Type' : 'text/plain'});
              response.write(data);
              response.end();
          } else {
              console.log("Path = " + pathname + ", Serving page");
              fs.readFile(asset_path + 'index.html', function(err, file_contents) {
                  if (err) throw err;

                  response.writeHead(200, {'Content-Type': 'text/html'});
                  response.write(file_contents);
                  response.end();
              });
          }
      });
    });

function start() {
    http.createServer(requestHandler).listen(1337, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:1337/');
}
exports.start = start;
