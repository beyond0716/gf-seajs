define('leftmenu', function (require, exports, module) {
  var $ = require('jquery'),
      template = require('template'),
      api = require('api'),
      public = require('public');

  function init() {
    getTags({pageSize: 100, pageIndex: 1});
  }

  // 获取标签
  function getTags(query) {
    $.when(api.help.getTags(query))
        .done(function (json) {
          var tags = json.message.rows,
              str = '';
          tags.forEach(function (item) {
            str += '<li tagid="' + item.id + '">' + item.name + '</li>';
          });
          $("#left-menu").append(str);
        });
  }

  $(function () {
    init();
  });
});