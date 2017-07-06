define(function (require, exports, module) {
  var common = require('common');
  var template = require('template');
  var api = require('api');

  exports.init = function () {
    getTopics();
  }

  function s() {
    console.log('suc1');
  }

  function e() {
    console.log('err1');
  }

  function getTopics() {
    $.when(api.topic.getTopics())
        .done(function (json) {
          console.log('suc');
          // template.templateRender('topicsList', json, $('#content').get(0));
          console.log(json)
        })
        .fail(function (err) {
          console.log('err');
          console.log(err);
        });
  }

});
