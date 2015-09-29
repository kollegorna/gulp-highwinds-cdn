# gulp-highwinds-cdn
[![NPM](https://nodei.co/npm/gulp-highwinds-cdn.png)](https://npmjs.org/package/gulp-highwinds-cdn)

Highwinds CDN plugin for [gulp](https://github.com/wearefractal/gulp).

### Install
	npm install --save-dev gulp-highwinds-cdn

### Config
Setup a `highwinds.json` file or load these through another config file or env vars.

```javascript
{
  "username": "HIGHWINDS-USERNAME",
  "password": "HIGHWINDS-PASSWORD",
  "accountId": "HIGHWINDS-ACCOUNT-ID",
  "url": "URL-TO-PURGE"
}
```
### Usage

```javascript
var fs = require('fs');
var gulp = require('gulp');
var cdn = require("gulp-highwinds-cdn");

var highwinds = JSON.parse(fs.readFileSync('./highwinds.json'));

gulp.task('cdn-purge', function() {
  cdn(highwinds);
});
```

### License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

