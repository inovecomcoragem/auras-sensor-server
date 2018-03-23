process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require("../app/server").server;
var app = server.app;

chai.use(chaiHttp);

describe("Arduino server", function() {
  describe("route /light", function() {
    beforeEach(function() {
      server.light = 1;
    });

    it("returns current state of globe", function(done) {
      chai.request(app).get('/light').end(function(err, res) {
        if (err) done(err);
        res.should.have.status(200);
        parseInt(res.text).should.equal(1);
        done();
      });
    });
  });

  describe("route /touch", function() {
    beforeEach(function() {
      server.touch = 0;
    });

    it("changes state of touch", function(done) {
      chai.request(app).post('/touch/'+1).end(function(err, res) {
        if (err) done(err);
        res.should.have.status(200);
        server.touch.should.equal(1);
        done();
      });
    });
  });
});

describe("App server", function() {
  describe("route /touch", function() {
    beforeEach(function() {
      server.touch = 1;
    });

    it("returns current state of touch", function(done) {
      chai.request(app).get('/touch').end(function(err, res) {
        if (err) done(err);
        res.should.have.status(200);
        parseInt(res.text).should.equal(1);
        done();
      });
    });  
  });

  describe("route /light", function() {
    beforeEach(function() {
      server.light = 0;
    });

    it("changes state of light", function(done) {
      chai.request(app).post('/light/'+1).end(function(err, res) {
        if (err) done(err);
        res.should.have.status(200);
        server.light.should.equal(1);
        done();
      });
    });
  });
});
