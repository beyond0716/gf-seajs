define(function (require, exports, module) {
  var $ = require('jquery');

  /**
   *对Date的扩展，将 Date 转化为指定格式的String
   *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   *例子：
   *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
   *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
   */
  Date.prototype.format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1,                 //月份
      "d+": this.getDate(),                    //日
      "h+": this.getHours(),                   //小时
      "m+": this.getMinutes(),                 //分
      "s+": this.getSeconds(),                 //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  Date.prototype.dateFormat = function (fmt) {

    var d = this;

    var zeroize = function (value, length) {

      if (!length) length = 2;

      value = String(value);

      for (var i = 0, zeros = ''; i < (length - value.length); i++) {

        zeros += '0';

      }

      return zeros + value;

    };

    return fmt.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function ($0) {

      switch ($0) {

        case 'd':
          return d.getDate();

        case 'dd':
          return zeroize(d.getDate());

        case 'ddd':
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];

        case 'dddd':
          return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];

        case 'M':
          return d.getMonth() + 1;

        case 'MM':
          return zeroize(d.getMonth() + 1);

        case 'MMM':
          return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];

        case 'MMMM':
          return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];

        case 'yy':
          return String(d.getFullYear()).substr(2);

        case 'yyyy':
          return d.getFullYear();

        case 'h':
          return d.getHours() % 12 || 12;

        case 'hh':
          return zeroize(d.getHours() % 12 || 12);

        case 'H':
          return d.getHours();

        case 'HH':
          return zeroize(d.getHours());

        case 'm':
          return d.getMinutes();

        case 'mm':
          return zeroize(d.getMinutes());

        case 's':
          return d.getSeconds();

        case 'ss':
          return zeroize(d.getSeconds());

        case 'l':
          return zeroize(d.getMilliseconds(), 3);

        case 'L':
          var m = d.getMilliseconds();

          if (m > 99) m = Math.round(m / 10);

          return zeroize(m);

        case 'tt':
          return d.getHours() < 12 ? 'am' : 'pm';

        case 'TT':
          return d.getHours() < 12 ? 'AM' : 'PM';

        case 'Z':
          return d.toUTCString().match(/[A-Z]+$/);

        // Return quoted strings with the surrounding quotes removed

        default:
          return $0.substr(1, $0.length - 2);

      }
    })
  }

  /**
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * eg:
   * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
   * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
   * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
   * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
   * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
   */
  Date.prototype.timeFormat = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
      "H+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    var week = {
      "0": "%u65E5",
      "1": "%u4E00",
      "2": "%u4E8C",
      "3": "%u4E09",
      "4": "%u56DB",
      "5": "%u4E94",
      "6": "%u516D"
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? unescape("%u661F%u671F") : unescape("%u5468")) : "") + unescape(week[this.getDay() + ""]));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  /**
   * 日期格式化
   *格式 YYYY/yyyy/YY/yy 表示年份
   * MM/M 月份
   * W/w 星期
   * dd/DD/d/D 日期
   * hh/HH/h/H 时间
   * mm/m 分钟
   * ss/SS/s/S 秒
   */
  Date.prototype.dateTimeFormat = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth().toString() : '0' + this.getMonth());
    str = str.replace(/M/g, this.getMonth());

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
  }

  /**
   * 判断闰年
   * @returns {boolean}
   */
  Date.prototype.isLeapYear = function () {
    return (0 == this.getYear() % 4 && ((this.getYear() % 100 != 0) || (this.getYear() % 400 == 0)));
  }

  /**
   * 求两个时间的天数差 日期格式为 YYYY-MM-dd
   */
  function dateBetween(DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return Math.abs(cha);
  }

  /**
   * 日期计算
   * @param strInterval
   * @param Number
   * @returns {Date}
   * @constructor
   */
  Date.prototype.dateAdd = function (strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
      case 's' :
        return new Date(Date.parse(dtTmp) + (1000 * Number));
      case 'n' :
        return new Date(Date.parse(dtTmp) + (60000 * Number));
      case 'h' :
        return new Date(Date.parse(dtTmp) + (3600000 * Number));
      case 'd' :
        return new Date(Date.parse(dtTmp) + (86400000 * Number));
      case 'w' :
        return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
      case 'q' :
        return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
      case 'm' :
        return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
      case 'y' :
        return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
  }

  /**
   * 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串
   * @param strInterval
   * @param dtEnd
   * @returns {*}
   * @constructor
   */
  Date.prototype.dateDiff = function (strInterval, dtEnd) {
    var dtStart = this;
    if (typeof dtEnd == 'string')//如果是字符串转换为日期型
    {
      dtEnd = StringToDate(dtEnd);
    }
    switch (strInterval) {
      case 's' :
        return parseInt((dtEnd - dtStart) / 1000);
      case 'n' :
        return parseInt((dtEnd - dtStart) / 60000);
      case 'h' :
        return parseInt((dtEnd - dtStart) / 3600000);
      case 'd' :
        return parseInt((dtEnd - dtStart) / 86400000);
      case 'w' :
        return parseInt((dtEnd - dtStart) / (86400000 * 7));
      case 'm' :
        return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
      case 'y' :
        return dtEnd.getFullYear() - dtStart.getFullYear();
    }
  }

  /**
   * 日期输出字符串，重载了系统的toString方法
   * @param showWeek
   * @returns {string}
   */
  Date.prototype.toString = function (showWeek) {
    var myDate = this;
    var str = myDate.toLocaleDateString();
    if (showWeek) {
      var Week = ['日', '一', '二', '三', '四', '五', '六'];
      str += ' 星期' + Week[myDate.getDay()];
    }
    return str;
  }

  /**有问题待验证
   * 日期合法性验证
   * 格式为：YYYY-MM-DD或YYYY/MM/DD
   */
  exports.isValidDate=function(DateStr) {
    var sDate = DateStr.replace(/(^\s+|\s+$)/g, ''); //去两边空格;
    if (sDate == '') return true;
    //如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为''
    //数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式
    var s = sDate.replace(/[\d]{ 4,4 }[\-/]{ 1 }[\d]{ 1,2 }[\-/]{ 1 }[\d]{ 1,2 }/g, '');
    if (s == '') //说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D
    {
      var t = new Date(sDate.replace(/\-/g, '/'));
      var ar = sDate.split(/[-/:]/);
      if (ar[0] != t.getYear() || ar[1] != t.getMonth() + 1 || ar[2] != t.getDate()) {
        //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');
        return false;
      }
    }
    else {
      //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');
      return false;
    }
    return true;
  }

  /**有问题待验证
   * 日期时间检查
   * 格式为：YYYY-MM-DD HH:MM:SS
   */
  exports.checkDateTime=function(str) {
    var reg = /^(\d+)-(\d{ 1,2 })-(\d{ 1,2 }) (\d{ 1,2 }):(\d{ 1,2 }):(\d{ 1,2 })$/;
    var r = str.match(reg);
    if(r==null)return false;
    r[2]=r[2]-1;
    var d= new Date(r[1],r[2],r[3],r[4],r[5],r[6]);
    if(d.getFullYear()!=r[1])return false;
    if(d.getMonth()!=r[2])return false;
    if(d.getDate()!=r[3])return false;
    if(d.getHours()!=r[4])return false;
    if(d.getMinutes()!=r[5])return false;
    if(d.getSeconds()!=r[6])return false;
    return true;
  }

  /**
   * 把日期分割成数组
   * @returns {*}
   */
  Date.prototype.toArray = function() {
    var myDate = this;
    var myArray = Array();
    myArray[0] = myDate.getFullYear();
    myArray[1] = myDate.getMonth()+1;
    myArray[2] = myDate.getDate();
    myArray[3] = myDate.getHours();
    myArray[4] = myDate.getMinutes();
    myArray[5] = myDate.getSeconds();
    return myArray;
  }

  /**
   * 取得日期数据信息
   * 参数 interval 表示数据类型
   * y 年 m月 d日 w星期 ww周 h时 n分 s秒
   * @param interval
   * @returns {string}
   */
  Date.prototype.datePart = function(interval){
    var myDate = this;
    var partStr='';
    var Week = ['日','一','二','三','四','五','六'];
    switch (interval)
    {
      case 'y' :partStr = myDate.getFullYear();break;
      case 'm' :partStr = myDate.getMonth()+1;break;
      case 'd' :partStr = myDate.getDate();break;
      case 'w' :partStr = Week[myDate.getDay()];break;
      case 'ww' :partStr = myDate.WeekNumOfYear();break;
      case 'h' :partStr = myDate.getHours();break;
      case 'n' :partStr = myDate.getMinutes();break;
      case 's' :partStr = myDate.getSeconds();break;
    }
    return partStr;
  }

  /**
   * 有问题待处理
   * 取得当前日期所在月的最大天数
   * @returns {*}
   */
  Date.prototype.maxDayOfDate = function(){
    var myDate = this;
    var ary = myDate.toArray();
    var date1 = (new Date(ary[0],ary[1]+1,1));
    var date2 = date1.dateAdd(1,'m',1);
    var result = myDate.dateDiff(date1.dateTimeFormat('yyyy-MM-dd'),date2.dateTimeFormat('yyyy-MM-dd'));
    return result;
  }

  /**
   * 有问题待处理
   * 取得当前日期所在周是一年中的第几周
   * @returns {*}
   * @constructor
   */
  Date.prototype.WeekNumOfYear = function(){
    var myDate = this;
    var ary = myDate.toArray();
    var year = ary[0];
    var month = ary[1]+1;
    var day = ary[2];
    /*document.write('< script language=VBScript\> \n');
    document.write('myDate = Datue(''+month+'-'+day+'-'+year+'') \n');
    document.write('result = DatePart('ww', myDate) \n');
    document.write(' \n');
    return result;*/
  }
 
  /**
   * 有问题待处理
   * 字符串转成日期类型
   * 格式 MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd
   * @param DateStr
   * @returns {Date}
   */
  exports.stringToDate=function(DateStr){
    var converted = Date.parse(DateStr);
    var myDate = new Date(converted);
    if (isNaN(myDate))
    {
      //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';  
      var arys= DateStr.split('-');
      myDate = new Date(arys[0],--arys[1],arys[2]);
    }
    return myDate;
  }

  exports.clockon=function() {
    var now = new Date();
    var year = now.getFullYear(); //getFullYear getYear
    var month = now.getMonth();
    var date = now.getDate();
    var day = now.getDay();
    var hour = now.getHours();
    var minu = now.getMinutes();
    var sec = now.getSeconds();
    var week;
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    week = arr_week[day];
    var time = "";
    time = year + "年" + month + "月" + date + "日" + " " + hour + ":" + minu + ":" + sec + " " + week;
    $("#content").html(time);
    var timer = setTimeout("clockon()", 1000);
  }



  //给Number类型增加一个add方法，调用起来更加方便。
  Number.prototype.add = function (arg) {
    return accAdd(arg, this);
  };

// 给Number类型增加一个mul方法，调用起来更加方便。
  Number.prototype.sub = function (arg) {
    return accMul(arg, this);
  };

  // 给Number类型增加一个mul方法，调用起来更加方便。
  Number.prototype.mul = function (arg) {
    return accMul(arg, this);
  };
//给Number类型增加一个div方法，调用起来更加方便。
  Number.prototype.div = function (arg) {
    return accDiv(this, arg);
  };

});