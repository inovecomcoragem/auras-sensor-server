var fs = require('fs');
var async = require('async');
var Flickr = require('flickr-sdk');

var flickrAuth = Flickr.OAuth.createPlugin(
  process.env.FLICKR_CONSUMER_KEY,
  process.env.FLICKR_CONSUMER_SECRET,
  process.env.FLICKR_OAUTH_TOKEN,
  process.env.FLICKR_OAUTH_TOKEN_SECRET
);

var flickrRest = new Flickr(process.env.FLICKR_CONSUMER_KEY);
var tempFile = __dirname + '/../temp.jpg';

function FlickrService(data) {

  this.writeImage = function(cb) {
    cb(null, tempFile, data.image, 'base64');
  };

  this.upload = function(cb) {
    var upload = new Flickr.Upload(flickrAuth, tempFile, {
      title: data.code
    });

    upload.then(function(res) {
      cb(null, res.body.photoid._content);
    }).catch(function(err) {
      cb(err);
    });
  };

  this.getUrl = function(id, cb) {
    flickrRest.photos.getSizes({
      photo_id: id
    }).then(function(res) {
      res.body.sizes.size.forEach(function(img) {
        if(img.label.includes('riginal')) {
          data.flickr_url = img.source;
          data.datetime = new Date();
          cb(null, data);
        }
      });
    }).catch(function(err) {
      cb(err);
    });
  };

  this.updatePersonData = function(cb) {
    async.waterfall([
      this.writeImage,
      fs.writeFile,
      this.upload,
      this.getUrl
    ], function (err, result) {
      if(err) cb(err);
      cb(null, data);
    });
  };
}

module.exports = FlickrService;
