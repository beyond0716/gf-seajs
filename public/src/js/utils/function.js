define(function (require, exports, module) {
  module.exports = {
    HTMLEncode: HTMLEncode,
    HTMLDecode: HTMLDecode
  };

  /**
   * HTML转义
   * @param html
   * @returns {*}
   * @constructor
   */
  function HTMLEncode(html) {
    var temp = document.createElement('div');
    temp.textContent ? temp.textContent = html : temp.innerText = html;
    var output = temp.innerHTML;
    temp = null;
    return output;
  }

  /**
   * HTML反转义
   * @param text
   * @returns {*|string}
   * @constructor
   */
  function HTMLDecode(text) {
    var temp = document.createElement('div');
    temp.innerHTML = text;
    var output = temp.textContent || temp.innerText;
    temp = null;
    return output;
  }


  /**
   * 合并对象
   * @param target
   * @returns {*}
   */
  function assign(target) {
    if (target === null) {
      return;
    }
    target = Object(target);
    for (var i = 1, len = arguments.length; i < len; i++) {
      var source = arguments[i];
      if (source !== null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  }

  /**
   * 数组快速排序
   * @param arr
   * @returns {*}
   */
  function quickSort(arr) {
    if (arr.length <= 1) {
      return arr;
    }
    var baseIndex = Math.floor(arr.length / 2);
    var baseEl = arr.splice(baseIndex, 1)[0];
    var left = [], right = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] < baseEl) {
        left.push(arr[i]);
      }
      if (arr[i] > baseEl) {
        right.push(arr[i]);
      }
    }
    return quickSort(left).concat([baseEl], quickSort(right));
  }

  /**
   * 有序数组二分查找递归算法
   * @param val
   * @param arr
   * @returns {*}
   */
  function erFen(val, arr) {
    if (arr.length < 1 || val < arr[0] || val > arr[arr.length - 1]) {
      return false;
    } else if (val === arr[0] || val === arr[arr.length - 1]) {
      return true;
    } else if (arr.length === 1) {
      return false;
    }
    var res = [];
    var baseIndex = Math.floor(arr.length / 2);
    if (val > arr[baseIndex]) {
      res = arr.slice(baseIndex + 1);
    } else if (val === arr[baseIndex]) {
      return true;
    } else if (val < arr[baseIndex]) {
      res = arr.slice(0, baseIndex);
    }
    return erFen(val, res);
  }

  /**
   * 数组随机排序
   * @param arr
   * @param newArr
   * @returns {*}
   */
  function shuffle(arr) {
    var i, len = arr.length;
    for (i = len - 1; i >= 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1));
      var temp = arr[randomIndex];
      arr[randomIndex] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }

  /**
   * 数组随机排序
   * @param arr
   * @param newArr
   * @returns {*}
   */
  function randomSort(arr, newArr) {
    if (arr.length == 1) {
      newArr.push(arr[0]);
      return newArr;
    }
    var random = Math.floor(Math.random() * arr.length);
    newArr.push(arr[random]);
    arr.splice(random, 1);
    return randomSort(arr, newArr);
  }

  /**
   * 获取一个介于min和max之间的随机数
   * @param min
   * @param max
   * @returns {*}
   */
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min
  }

  /**
   * 获取一个介于min和max之间的整型随机数
   * @param min
   * @param max
   * @returns {number}
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  /**
   * 获取查询字符串参数对象
   */
  function getQueryStringArgs() {
    var qs = location.search > 0 ? location.search.substring(1) : '';
    var items = qs.length > 0 ? qs.split('&') : [],
        args = {},
        item = [],
        name = null,
        value = null;
    for (var i = 0, len = items.length; i < len; i++) {
      item = items[i].split('=');
      name = decodeURIComponent(item[0]);
      value = decodeURIComponent(item[1]);
      args[name] = value;
    }
    return args;
  }

  /**
   * 获取某个查询字符串参数
   * @param name
   * @returns {*}
   */
  function getQuery(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    return r ? decodeURIComponent(r[2]) : null;
  }

  /**
   * 数组去重
   * @param arr
   * @returns {*}
   */
  function arrUnique(arr) {
    return arr.filter(function (item, index, self) {
      return arr.indexOf(item) == index;
    });
  }

  /**
   * 比较两个对象的值是否相等
   * @param obj1
   * @param obj2
   * @returns {boolean}
   */
  function objCompare(obj1, obj2) {
    if (typeof obj1 != typeof obj2) {
      return false;
    }
    if (typeof obj1.length != typeof obj2.length) {
      return false;
    }
    var keyArr1 = [],
        keyArr2 = [];
    for (var key1 in obj1) {
      keyArr1.push(key1);
    }
    for (var key2 in obj2) {
      keyArr2.push(key2);
    }
    if (keyArr1.length != keyArr2.length) {
      return false;
    }
    for (var i = 0, len = keyArr2.length; i < len; i++) {
      keyArr1.push(keyArr2[i]);
    }
    var keyArr = arrUnique(keyArr1);
    for (var i = 0, len = keyArr.length; i < len; i++) {
      if (keyArr[i] in obj1 && keyArr[i] in obj2) {
        if (typeof obj1[keyArr[i]] === 'object' && typeof obj2[keyArr[i]] === 'object') {
          return objCompare(obj1[keyArr[i]], obj2[keyArr[i]]);
        } else if (obj1[keyArr[i]] !== obj2[keyArr[i]]) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  /**
   ** 加法函数，用来得到精确的加法结果
   ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
   ** 调用：accAdd(arg1,arg2)
   ** 返回值：arg1加上arg2的精确结果
   **/
  function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
      r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
      r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", "")) * cm;
      } else {
        arg1 = Number(arg1.toString().replace(".", "")) * cm;
        arg2 = Number(arg2.toString().replace(".", ""));
      }
    } else {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
  }



  /**
   ** 减法函数，用来得到精确的减法结果
   ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
   ** 调用：accSub(arg1,arg2)
   ** 返回值：arg1加上arg2的精确结果
   **/
  function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  }


  /**
   ** 乘法函数，用来得到精确的乘法结果
   ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
   ** 调用：accMul(arg1,arg2)
   ** 返回值：arg1乘以 arg2的精确结果
   **/
  function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
      m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  }



  /**
   ** 除法函数，用来得到精确的除法结果
   ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
   ** 调用：accDiv(arg1,arg2)
   ** 返回值：arg1除以arg2的精确结果
   **/
  function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
      t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
      r1 = Number(arg1.toString().replace(".", ""));
      r2 = Number(arg2.toString().replace(".", ""));
      return (r1 / r2) * pow(10, t2 - t1);
    }
  }

  /**
   * 四舍五入返回整数时不保留小数位,如，2.999，保留2位小数，返回 3
   * @param num
   * @param len
   * @returns {number}
   */
  function getRound(num, len) {
    return Math.round(num * Math.pow(10, len)) / Math.pow(10, len);
  }

  /**
   * 四舍五入任何情况下都保留小数位,如，2.999，保留2位小数，返回 3.00
   * @param num
   * @param len
   * @returns {string}
   */
  function getDecimal(num, len) {
    return num.toFixed(len);
  }

  /**
   * 倒计时
   * 需要在按钮上绑定单击事件
   */
  function countDown(obj, second) {
    if (second >= 0) {
      if (typeof buttonDefaultValue === 'undefined') {
        buttonDefaultValue = obj.defaultValue;
      }
      obj.disabled = true;
      obj.value = buttonDefaultValue + '(' + second + ')';
      second--;
      setTimeout(function () {
        countDown(obj, second);
      }, 1000);
    } else {
      obj.disabled = false;
      obj.value = buttonDefaultValue;
    }
  }
});