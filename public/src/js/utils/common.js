define(function (require, exports, module) {
  var $ = require('jquery');
  var dialog = require('dialog');

  // self start
  /**
   *对Date的扩展，将 Date 转化为指定格式的String
   *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   *例子：
   *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
   *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
   */
  exports.dateFormat = function (ts, fmt) {
    var date = new Date(parseInt(ts)),
        o = {
          "M+": date.getMonth() + 1,                 //月份
          "d+": date.getDate(),                    //日
          "h+": date.getHours(),                   //小时
          "m+": date.getMinutes(),                 //分
          "s+": date.getSeconds(),                 //秒
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度
          "S": date.getMilliseconds()             //毫秒
        };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  // 获取表单数据并格式化成JSON
  exports.getFormData = function (form) {
    var dataArray = form.serializeArray(),
        data = {};
    for (var i = 0, len = dataArray.length; i < len; i++) {
      var field = dataArray[i];
      data[field.name] = field.value;
    }
    return data;
  }

  // 提示框
  exports.alert = function (msg) {
    var d = dialog({
      content: msg,
      skin: 'my-alert',
      padding: "7px"
    });
    d.show();
    setTimeout(function () {
      d.close().remove();
    }, 200000);
  }

  // 确认框
  exports.confirm = function (title, content, yes, no) {
    var d = dialog({
      title: title,
      content: content,
      ok: function () {
        if (yes) {
          return yes.call(this);
        }
      },
      okValue: '确定',
      cancel: function () {
        if (no) {
          return no.call(this);
        }
      },
      cancelValue: '取消',
      skin: 'my-confirm',
      padding: "20px"
    });
    d.show();
  }

  // 气泡浮层
  exports.bubble = function (msg, elem) {
    var d = dialog({
      content: msg,
      align: "bottom left",
      quickClose: true
    });
    d.show(elem);
  }

  // 弹出框
  exports.popup = function (elem) {
    var d = dialog({
      content: elem,
      skin: 'my-popup',
      padding: 0
    });
    d.showModal();
  }

  var htmlUtil = {
    /*1.用浏览器内部转换器实现html转码*/
    htmlEncode: function (html) {
      //1.首先动态创建一个容器标签元素，如DIV
      var temp = document.createElement("div");
      //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
      (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
      //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
      var output = temp.innerHTML;
      temp = null;
      return output;
    },
    /*2.用浏览器内部转换器实现html解码*/
    htmlDecode: function (text) {
      //1.首先动态创建一个容器标签元素，如DIV
      var temp = document.createElement("div");
      //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
      temp.innerHTML = text;
      //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
      var output = temp.innerText || temp.textContent;
      temp = null;
      return output;
    },
    /*3.用正则表达式实现html转码*/
    htmlEncodeByRegExp: function (str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&/g, "&amp;");
      s = s.replace(/</g, "&lt;");
      s = s.replace(/>/g, "&gt;");
      s = s.replace(/ /g, "&nbsp;");
      s = s.replace(/\'/g, "&#39;");
      s = s.replace(/\"/g, "&quot;");
      return s;
    },
    /*4.用正则表达式实现html解码*/
    htmlDecodeByRegExp: function (str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&amp;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "\'");
      s = s.replace(/&quot;/g, "\"");
      return s;
    }
  };

  exports.htmlUtil = htmlUtil;

  //设置cookie: cookie名，cookie值，天数
  exports.setCookie = function (name, value, iDay) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = name + '=' + escape(value) + '; expires = ' + oDate
  }

//获取cookie
  exports.getCookie = function (name) {
    var arr = document.cookie.split(';'); //将cookie切割成数组
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split('='); //数组元素以等号切割
      if (arr2[0] == name) {
        return unescape(arr2[1]); //获取cookie名对应的cookie值
      }
    }
    return ''; //如果没有获取到值，返回空字符串
  }

//删除cookie
  exports.delCookie = function (name) {
    setCookie(name, 1, -1);
  }

  // 弹出数组对象
  exports.alertObj = function (obj) {
    var output = "";
    for (var i in obj) {
      var property = obj[i];
      output += i + " = " + property + "\n";
    }
    alert(output);
  }

  // 区分平台类型
  exports.mobPlatformType = function () {
    var platformType = "others", //平台类型模式是其它
        platforms = [//一些主流设备类型库
          "iphone",
          "ipod",
          "ipad",
          "android",
          "windows phone os"
        ],
        reg = null,//正则匹配的设备字符
        userAgent = navigator.userAgent.toLowerCase(),//设备字符串
        i = 0,//初始值
        l = platforms.length,//设备的数量上限
        p = "";//当前设备
    for (; i < l; i++) {
      p = platforms[i];
      reg = new RegExp(p, "i");//正则设备匹配
      if (userAgent.match(reg))//正则判断是否为iPhone
      {
        platformType = p;
      }
    }
    return platformType;
  }

  // 扩展jQuery实例对象
  $.fn.extend({
    ellipsis: function (maxwidth) {
      this.each(function () {                         //循环选中的控件
        if ($(this).text().length > maxwidth) {     //如果控件的text的长度大于maxwidth
          //则截取maxwidth的长度
          $(this).text($(this).text().substring(0, maxwidth));
          $(this).html($(this).html() + '...');  //在当前文本后面添加省略号
        }
      });
    }
  });

  // self end


  /**
   * 将表单转成JSON对象
   */
  exports.formToJson = function (form) {
    var jsonResult = {};
    var dataArray = $(form).serializeArray();
    for (var i = 0; i < dataArray.length; i++) {
      var dataItem = dataArray[i];
      var name = dataItem.name;
      var value = dataItem.value;
      if (name in jsonResult) {
        if (jsonResult[name] instanceof Array) {
          jsonResult[name].push(value);
        } else {
          jsonResult[name] = [jsonResult[name], value];
        }
      } else {
        jsonResult[name] = value;
      }
    }
    return jsonResult;
  };

  /**
   * 获取查询字符串键值对对象
   * @param {String} url 不传则取地址栏
   * @return {Object}
   */
  exports.getQueryParams = function (url) {
    var queryString = url ? url.substring(url.indexOf('?')) : window.location.search;
    var result = {};
    var keyValuePairs = queryString.match(/[^&?]*=[^&]*/g);
    if (keyValuePairs) {
      for (var i = 0; i < keyValuePairs.length; i++) {
        var keyValuePair = keyValuePairs[i].match(/([^&?]*)=([^&]*)/);
        var key = keyValuePair[1];
        var value = decodeURIComponent(keyValuePair[2]);
        if (result[key] !== undefined) {
          if (!(result[key] instanceof Array)) {
            result[key] = [result[key]];
          }
          result[key].push(value);
        } else {
          result[key] = value;
        }
      }
    }
    return result;
  };

  /**
   * 加载js文件
   */
  exports.loadJsFile = function (url) {
    //$('#MainFrame').siblings('.dimmer.ui.page').remove();
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var node = document.createElement("script");
    var oldNode = $(head).find('script[src="' + url + '"]');
    oldNode.remove();
    node.charset = 'utf-8';
    node.async = true;
    node.src = url;
    head.appendChild(node);
  };

  /**
   * 根据日期格式(2012-01-01)获取long类型的timestamp
   */
  exports.getTimeStamp = function (str) {
    if (str.length == 0) return "";
    var date = new Date(Date.parse(str.replace(/-/g, '/')));
    return date.getTime();
  };

  /**
   * 根据日期格式timestamp获取yyyy-mm-dd类型的字符串
   */
  exports.getTimeStr = function (dateLong) {
    if (dateLong.length == 0) return "";
    var date = new Date(parseInt(dateLong));
    var year = date.getFullYear();
    var month = exports.formatTime(date.getMonth() + 1);
    var day = exports.formatTime(date.getDate());
    var result = year + '-' + month + '-' + day;
    return result;
  };

  /**
   * gettimestr中，将日期和月份不满10的前面加0
   */
  exports.formatTime = function (time) {
    var result = time.toString();
    if (result.length == 1) {
      result = '0' + result;
    }
    return result;
  };

  /**
   * 返回某个指定的对象在数组中首次出现的位置，如果找不到此对象则返回-1
   * @param arr 所要查找的数组
   * @param searchValue 要查找的对象
   * @param fromIndex 开始查找的位置, 合法取值0到arr.length-1
   * @returns {int}
   */
  exports.arrIndexOf = function (arr, searchValue, fromIndex) {
    if (arr.indexOf) { //非ie8
      return arr.indexOf(searchValue, fromIndex);
    }
    fromIndex = fromIndex || 0;
    for (var i = fromIndex; i < arr.length; i++) {
      if (arr[i] === searchValue) {
        return i;
      }
    }
    return -1;
  };

  // 遍历
  exports.forEach = function (data, fn) {
    if (Object.prototype.toString.call(data) === '[object Array]') {
      for (var i = 0, len = data.length; i < len; i++) {
        fn.call(data[i], data[i], i, data);
      }
    } else if (Object.prototype.toString.call(data) === '[object Object]') {
      for (var key in data) {
        fn.call(data[key], data[key], key, data);
      }
    }
  }

  // 百分比
  exports.percentage = function (num1, num2) {
    return Math.round(num1 / num2 * 10000) / 100 + '%';
  }

  // 判断是否为数组
  exports.isArray = function (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }

  // 判断数组中是否有某个值
  exports.inArray = function (val, arr) {
    return arr.some(function (item) {
      return item === val;
    });
  }

  // 客户端浏览器判断
  exports.isBrowser = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod|ios/.test(ua)) {
      return 'ios';
    } else if (/android/.test(ua)) {
      return 'android';
    } else {
      return 'pc';
    }
  }

  // 微信浏览器判断
  exports.isWeixinBrowser = function () {
    var ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false;
  }

  


  /********************* string扩展方法 Begin *********************/

  /**
   * 将字符串中的{}替换为对应的内容
   * 例如：'字符串{0}字符串{1}'.format(a, b);
   * 输出：字符串a字符串b
   */
  String.prototype.format = function () {
    var str = this.toString();
    for (var i = 0; i < arguments.length; i++) {
      str = str.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    }
    return str;
  }

  /********************* string扩展方法 End *********************/


});