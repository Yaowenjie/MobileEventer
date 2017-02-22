var Nightmare = require('nightmare');
var vo = require('vo');
var nightmare = Nightmare({
  show: false
});

var scope = [43000, 45000];

nightmare.on('console', function (type, msg) {
  console.log(msg);
});

var run = function * () {
  var url = 'https://event.mobike.com/coupon/index.html?event=';
  var titles = [];
  for (var i = scope[0]; i < scope[1]; i++) {
    var theUrl = url + i;
    process.stdout.write('>');
    var title = yield nightmare
      .goto(theUrl)
      .wait(100)
      .evaluate(function (theUrl) {
        var ele = document.querySelector('div.top');
        var isDisplay = window.getComputedStyle(ele, null).getPropertyValue("display") !== 'none';
        if (isDisplay) {
          var startEle = document.querySelector('div.part.start');
          var isStartDisplay = window.getComputedStyle(startEle, null).getPropertyValue("display") !== 'none';
          if (isStartDisplay) {
            console.log('The Url has activity:' + theUrl);
            return theUrl;
          }
        }
      }, theUrl)
      .title();
    titles.push(title);
  }
  yield nightmare.end();
  return titles;
};

vo(run)(function(err, titles) {
  // console.dir(titles);
  console.log('done');
});
