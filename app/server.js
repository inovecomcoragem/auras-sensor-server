var server = {};

var express = require('express');

var port = 8000;
var expressApp = express();
server.app = require('http').createServer(expressApp);
server.request = require('request');

server.light = 0;
server.touch = 0;

server.sendTextResponse = function(res, code, text) {
  res.set('Content-Type', 'text/plain');
  res.status(code).send(text.toString());
}

expressApp.get('/touch', function(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.match(/([0-9]+\.){3}([0-9]+)$/)[0];

  logExceptOnTest("GET touch/ from: " + ip);
  server.sendTextResponse(res, 200, server.touch);
});

expressApp.get('/light', function(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.match(/([0-9]+\.){3}([0-9]+)$/)[0];

  logExceptOnTest("GET light/ from: " + ip);
  server.sendTextResponse(res, 200, server.light);
});

expressApp.post('/touch/:value', function(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.match(/([0-9]+\.){3}([0-9]+)$/)[0];

  server.touch = parseInt(req.params.value || 0);

  logExceptOnTest("GET touch/ from: " + ip);
  server.sendTextResponse(res, 200, server.touch);
});

expressApp.post('/light/:value', function(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.match(/([0-9]+\.){3}([0-9]+)$/)[0];

  server.light = parseInt(req.params.value || 0);

  logExceptOnTest("GET light/ from: " + ip);
  server.sendTextResponse(res, 200, server.light);
});

expressApp.get('*', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.match(/([0-9]+\.){3}([0-9]+)$/)[0];

  logExceptOnTest("404 from: " + ip + " || at: " + req.params[0]);
  server.sendTextResponse(res, 404, "Nothing here");
});

expressApp.post('*', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  ip = ip.match(/([0-9]+\.){3}([0-9]+)$/)[0];

  logExceptOnTest("404 from: " + ip + " || at: " + req.params[0]);
  server.sendTextResponse(res, 404, "Nothing here");
});

server.app.listen(port);

function logExceptOnTest(string) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(string);
  }
}

module.exports = {
  server: server
}
