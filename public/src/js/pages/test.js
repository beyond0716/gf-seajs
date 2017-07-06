define('test', function (require, exports, module) {
  var $ = require('jquery');
  var template = require('template');
  var client = require('client');
  var check = require('check');

  exports.init=function () {

    var data = {
      title: '标签',
      list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
    };
    $('#content').append(template.getHtml('test', data));



  };
});
 