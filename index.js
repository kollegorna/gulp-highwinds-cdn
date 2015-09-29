'use strict';

var gutil = require('gulp-util');
var request = require('request');
var PLUGIN_NAME = "gulp-highwinds-cdn";

module.exports = function (options) {

  options = options || {};

  if(!options.username) {
    throw new gutil.PluginError(PLUGIN_NAME, "username not set!");
    return;
  }
  if(!options.password) {
    throw new gutil.PluginError(PLUGIN_NAME, "password not set!");
    return;
  }
  if(!options.accountId) {
    throw new gutil.PluginError(PLUGIN_NAME, "accountId not set!");
    return;
  }
  if(!options.url) {
    throw new gutil.PluginError(PLUGIN_NAME, "url not set!");
    return;
  }

  var params = {
    "password": options.password,
    "username": options.username,
    "grant_type": "password"
  };

  var accessToken;

  request.post({
    url  : 'https://striketracker.highwinds.com/auth/token',
    form : params,
    json : true
  }, function (err, res) {
    if(err) {
      throw new gutil.PluginError(PLUGIN_NAME, err)
      return;
    }
    if(!res && !res.statusCode) {
      throw new gutil.PluginError(PLUGIN_NAME, "Highwinds server not responding :(")
      return;
    }
    if(res.statusCode !== 200) {
      var errorMessage = "Authentication failed.";
      if(res.body && res.body.msg) {
        errorMessage = res.body.msg;
      }
      throw new gutil.PluginError(PLUGIN_NAME, errorMessage)
    }
    purgeCDN(res.body.access_token, options.url);
  });

  function purgeCDN(accessToken, url) {

    if(!url) {
      throw new gutil.PluginError(PLUGIN_NAME, "No purge URL specified!")
      return;
    }

    var purgeList = {
      "list": [
        {
          "url": url,
          "recursive": true
        }
      ]
    };

    request.post({
      url: 'https://striketracker.highwinds.com/api/accounts/' + options.accountId + '/purge',
      body: purgeList,
      json: true,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }, function(err, res) {
      if (err) {
        throw new gutil.PluginError(PLUGIN_NAME, err)
      } else if (res.statusCode !== 200) {
        var errorMessage = "Authentication failed.";
        if(res.body && res.body.msg) {
          errorMessage = res.body.msg;
        }
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, errorMessage));
      }
      else {
        gutil.log(PLUGIN_NAME, gutil.colors.green("Purge successful."));
      }
    });
  }
};

