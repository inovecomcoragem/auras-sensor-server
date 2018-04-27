process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require("../index").server;
var app = server.app;

chai.use(chaiHttp);

describe("Sensor server", function() {
  describe("route /get-light", function() {
    beforeEach(function() {
      server.light = 1;
    });

    it("returns current state of globe", function(done) {
      chai.request(app).get('/get-light').end(function(err, res) {
        if (err) done(err);
        res.should.have.status(200);
        parseInt(res.text).should.equal(1);
        done();
      });
    });
  });

  describe("route /set-touch", function() {
    beforeEach(function() {
      server.touch = 0;
    });

    it("changes state of touch", function(done) {
      chai.request(app).get('/set-touch/'+1).end(function(err, res) {
        if (err) done(err);
        res.should.have.status(200);
        server.touch.should.equal(1);
        done();
      });
    });
  });
});

describe("App server", function() {
  describe("route /get-touch", function() {
    beforeEach(function() {
      server.touch = 1;
    });

    it("returns current state of touch", function(done) {
      chai.request(app).get('/get-touch').end(function(err, res) {
        if (err) done(err);
        res.should.have.status(200);
        parseInt(res.text).should.equal(1);
        done();
      });
    });  
  });

  describe("route /set-light", function() {
    beforeEach(function() {
      server.light = 0;
    });

    it("changes state of light", function(done) {
      chai.request(app).get('/set-light/'+1).end(function(err, res) {
        if (err) done(err);
        res.should.have.status(200);
        server.light.should.equal(1);
        done();
      });
    });
  });
});
