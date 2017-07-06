define('helpAppDetail', function (require, exports, module) {
  var $ = require('jquery'),
      template = require('template'),
      api = require('api'),
      public = require('public');

  var articlesQuery={
    mailType: 1,
    category: 1,
    pageIndex: 1,
    pageSize: 100,
    sortTypes: 2,
    publishToClient: 1
  };

  function init() {
    getArticle({id: getId()});
  }

  // 获取文章id
  function getId() {
    var url = location.search;
    if (url.indexOf("?") != -1) {
      var urlStr = url.substr(1);
      var urlArr = urlStr.split("=");
      return urlArr[1];
    }
  }

  // 读取文章内容
  function getArticle(data) {
    $.when(api.help.getArticle(data))
        .done(function (json) {
          var article=json.message;
          $("#qa-detail .title").html(article.title);
          $("#qa-detail .content").html(article.body);
        });
  }

  $(function () {
    init();
  });
});