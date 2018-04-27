require('dotenv').load();

var server = {};
var express = require('express');
var cors = require('cors');
var expressApp = express();

server.request = require('request');
server.app = require('http').createServer(expressApp);

var port = process.env.PORT || 8000;

var corsOptions = {
  origin: [process.env.CORS_TEST_ORIGIN, process.env.CORS_PROD_ORIGIN],
  optionsSuccessStatus: 200
}

expressApp.use(cors(corsOptions));

server.light = 0;
server.touch = 0;

server.sendTextResponse = function(res, code, text) {
  res.set('Content-Type', 'text/plain');
  res.status(code).send(text.toString());
}

expressApp.get('/get-touch', function(req, res) {
  server.sendTextResponse(res, 200, server.touch);

  var ip = getIp(req);
  logExceptOnTest("get-touch/ from: " + ip);
});

expressApp.get('/get-light', function(req, res) {
  server.sendTextResponse(res, 200, server.light);

  var ip = getIp(req);
  logExceptOnTest("get-light/ from: " + ip);
});

expressApp.get('/set-touch/:value', function(req, res) {
  server.touch = parseInt(req.params.value || 0);
  server.sendTextResponse(res, 200, server.touch);

  var ip = getIp(req);
  logExceptOnTest("set-touch/" + server.touch + " from: " + ip);
});

expressApp.get('/set-light/:value', function(req, res) {
  server.light = parseInt(req.params.value || 0);
  server.sendTextResponse(res, 200, server.light);

  var ip = getIp(req);
  logExceptOnTest("set-light/" + server.light + " from: " + ip);
});

expressApp.get('*', function (req, res) {
  var ip = getIp(req);
  logExceptOnTest("404 from: " + ip + " at: " + req.params[0]);
  server.sendTextResponse(res, 404, "Nothing here");
});

server.app.listen(port);

function getIp(req) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return ip.match(/([0-9]+\.){3}([0-9]+)$/) ? ip.match(/([0-9]+\.){3}([0-9]+)$/)[0] : "0.0.0.0";
}

function logExceptOnTest(string) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(string);
  }
}

module.exports = {
  server: server
}
