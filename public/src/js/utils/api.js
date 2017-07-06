define('api', function (require, exports, module) {
  var $ = require('jquery');

  function isJSON(obj) {
    return Object.prototype.toString.call(obj) == '[object Object]' && !obj.length
  }

  function verifyRes(json) {
    return !!json.success;
  }

  function sendReq(url, opt, data, successCall, failCall) {
    var dtd = $.Deferred();
    data.t = new Date().getTime();
    var opt = $.extend({}, {
      url: url,
      data: data,
      success: function (res) {
        var json = null;
        if (!isJSON(res)) {
          try {
            json = $.parseJSON(res);
          } catch (ex) {
            dtd.resolve(res);
          }
        } else {
          json = res;
        }
        if (verifyRes(json)) {
          dtd.resolve(json);
          successCall && successCall(json);
        } else {
          dtd.reject(json);
          failCall && failCall(json);
        }
      },
      error: function (xhr, status, err) {
        dtd.reject(err);
        failCall && failCall(err);
      },
      timeout: 8000
    }, opt);
    $.ajax(opt);
    return dtd.promise();
  }

  function buildApi(url, opt) {
    return function (data, successCall, failCall) {
      data = data || {};
      return sendReq(url, opt, data, successCall, failCall)
    }
  }

  var baseUrl = ' https://cnodejs.org/api/v1';
  var topic = {};
  topic.getTopics = buildApi(baseUrl + '/topics', {type: 'GET'});

  module.exports = {
    topic: topic
  };
});