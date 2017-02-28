var Nightmare = require('nightmare');
var vo = require('vo');
var nightmare = Nightmare({
  show: false
});

var scope = [40000, 45000];

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
      .wait(120)
      .evaluate(function (theUrl) {
        var bodyClass = document.getElementsByTagName("body")[0].className;
        var topEle = document.querySelector('div.top');
        var isTopShow = window.getComputedStyle(topEle, null).getPropertyValue("display") !== 'none';
        if (bodyClass.indexOf('status') !== -1 && isTopShow) {
          var startEle = document.querySelector('div.part.start');
          var isStartShow = window.getComputedStyle(startEle, null).getPropertyValue("display") !== 'none';
          if (bodyClass === 'status-start' && isStartShow) {
            console.log('\n进行中活动: ' + theUrl);
          } else {
            console.log('\n过期活动: ' + theUrl);
          }
          return theUrl;
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
  if (err) {
    console.log('err:', err);
  }
  console.log('done');
});
