define('template', function (require, exports, module) {
  var template = require('template-native');

  //重定义模板边界
  template.defaults.openTag = '[[';
  template.defaults.closeTag = ']]';

  template.getHtml = function (id, json) {
    try {
      return template(id, json);
    } catch (e) {
      alert(e);
    }
  };

  // template.helper('dateFormat', tool.dateFormat);
  template.helper('xx', function (a) {
    return a + 10;
  });
  module.exports = template;
});