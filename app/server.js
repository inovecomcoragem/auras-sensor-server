var server = {};

var express = require('express');

var port = 8000;
var expressApp = express();
server.app = require('http').createServer(expressApp);
server.request = require('request');

server.light = [0, 0];
server.touch = [0, 0];

server.sendTextResponse = function(res, code, text) {
  res.set('Content-Type', 'text/plain');
  res.status(code).send(text.toString());
}

expressApp.get('/get-touch', function(req, res) {
  var ip = getIp(req);
  var id = ip.match("127.0.0.1") ? 0 : 1;
  logExceptOnTest("get-touch/ from: " + ip);

  server.sendTextResponse(res, 200, server.touch[id]);
});

expressApp.get('/get-light', function(req, res) {
  var ip = getIp(req);
  var id = ip.match("127.0.0.1") ? 0 : 1;
  logExceptOnTest("get-light/ from: " + ip);

  server.sendTextResponse(res, 200, server.light[id]);
});

expressApp.get('/set-touch/:value', function(req, res) {
  var ip = getIp(req);
  var id = ip.match("127.0.0.1") ? 0 : 1;
  logExceptOnTest("set-touch/ from: " + ip);

  server.touch[id] = parseInt(req.params.value || 0);
  server.sendTextResponse(res, 200, server.touch[id]);
});

expressApp.get('/set-light/:value', function(req, res) {
  var ip = getIp(req);
  var id = ip.match("127.0.0.1") ? 0 : 1;
  logExceptOnTest("set-light/ from: " + ip);

  server.light[id] = parseInt(req.params.value || 0);
  server.sendTextResponse(res, 200, server.light[id]);
});

expressApp.get('*', function (req, res) {
  var ip = getIp(req);
  logExceptOnTest("404 from: " + ip + " || at: " + req.params[0]);
  server.sendTextResponse(res, 404, "Nothing here");
});

server.app.listen(port);

function getIp(req) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return ip.match(/([0-9]+\.){3}([0-9]+)$/) ? ip.match(/([0-9]+\.){3}([0-9]+)$/)[0] : "0.0.0.0";
}

function logExceptOnTest(string) {
  console.log(string);
  if (process.env.NODE_ENV !== 'test') {
    //console.log(string);
  }
}

module.exports = {
  server: server
}
