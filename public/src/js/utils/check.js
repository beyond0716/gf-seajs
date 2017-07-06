define('check', function (require, exports, module) {
  // 校验昵称
  exports.nickname = function (str) {
    if (!str) {
      return {code: 1, message: '昵称不能为空'};
    }
    if (!/^(\w|[\u4e00-\u9fa5]){1,8}$/.test(str)) {
      return {code: 2, message: '昵称不能超过30个字符'};
    }
    return {code: 0, message: ''};
  };

  // 校验密码
  exports.password = function (str) {
    if (!str) {
      return {code: 1, message: '密码不能为空'};
    }
    if (!/^[a-zA-Z\d]{6,16}$/.test(str)) {
      return {code: 2, message: '密码应为6~16个字符（字母、数字）'};
    }
    return {code: 0, message: ''};
  };

  // 确认密码
  exports.passwordConfirm = function (str, init) {
    if (!init) {
      return {code: 1, message: '请输入原密码'};
    }
    if (!str) {
      return {code: 2, message: '请确认密码'};
    }
    if (str !== init) {
      return {code: 3, message: '两次密码输入不一致'};
    }
    return {code: 0, message: ''};
  };

  // 校验QQ
  exports.qq = function (str) {
    if (!str) {
      return {code: 1, message: 'QQ不能为空'};
    }
    if (!/^[1-9]\d{4,9}$/.test(str)) {
      return {code: 2, message: 'QQ格式不正确'};
    }
    return {code: 0, message: ''};
  };

  // 校验手机号
  exports.phone = function (str) {
    if (!str) {
      return {code: 1, message: '手机号不能为空'};
    }
    if (!/^1[34578]\d{9}$/.test(str)) {
      return {code: 2, message: '手机号格式不正确'};
    }
    return {code: 0, message: ''};
  };

  // 校验电话
  exports.telephone = function (str) {
    if (!str) {
      return {code: 1, message: '电话不能为空'};
    }
    if (!/^(\(\d{3,4}\)|\d{3,4}(?:-|\s))?\d{7,14}$/.test(str)) {
      return {code: 2, message: '电话格式不正确'};
    }
    return {code: 0, message: ''};
  };

  // 校验邮箱
  exports.email = function (str) {
    if (!str) {
      return {code: 1, message: '邮箱不能为空'};
    }
    if (!/^([\w\-.]+)@(([a-zA-Z\d\-])+\.)+([a-zA-Z\d]{2,4})$/.test(str)) {
      return {code: 2, message: '邮箱格式不正确'};
    }
    return {code: 0, message: ''};
  };

  // 校验身份证
  //支持15位和18位身份证号
  //支持地址编码、出生日期、校验位验证
  exports.id = function (str) {
    var city = {11: "北京",12: "天津",13: "河北",14: "山西",15: "内蒙古",21: "辽宁",22: "吉林",23: "黑龙江 ",31: "上海",32: "江苏",33: "浙江",34: "安徽",35: "福建",36: "江西",37: "山东",41: "河南",42: "湖北 ",43: "湖南",44: "广东",45: "广西",46: "海南",50: "重庆",51: "四川",52: "贵州",53: "云南",54: "西藏 ",61: "陕西",62: "甘肃",63: "青海",64: "宁夏",65: "新疆",71: "台湾",81: "香港",82: "澳门",91: "国外 "
    };
    if (!str) {
      return {code: 1, message: '身份证号码不能为空'};
    }
    if (!/^[1-9]\d{5}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(str)) {
      return {code: 2, message: '身份证号码格式不合法'};
    }
    if (!city[str.substr(0, 2)]) {
      return {code: 3, message: '身份证号码格式不合法'};
    }
    if (str.length == 18) {
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
          parity = [1, 0, 'x', 9, 8, 7, 6, 5, 4, 3, 2],
          i = 0,
          sum = 0;
      while (i < 17) {
        sum += code[i] + factor[i];
        i++;
      }
      if (parity[sum % 11] !== code[17].toLowerCase()) {
        return {code: 4, message: '身份证号码格式不合法'};
      }
    }
    var initDate = (+d.substr(6, 4) + 18) + '-' + d.substr(10, 2) + '-' + d.substr(12, 2);
    if (new Date(initDate).getTime() > new Date().getTime()) {
      return {code: 5, message: '未满18岁'};
    }
    return {code: 0, message: ''};
  };

  //是否为手机、电话
  exports.isPhone = function (str) {
    return /^1[34578]\d{9}|(\(\d{3,4}\)|\d{3,4}(?:-|\s))?\d{7,14}$/.test(str);
  };

  //是否为域名
  exports.isDomain = function (str) {
    return /^(([a-zA-Z\d\-])+\.)+([a-zA-Z\d]{2,4})$/i.test(str);
  };

  // 是否为IP地址
  exports.isIP = function (str) {
    return /^(?:(?:25[0-5]|2[0-4]\d|(?:1\d{2}|[1-9]?\d))\.){3}(?:25[0-5]|2[0-4]\d|(?:1\d{2}|[1-9]?\d))$/.test(str);
  };

  // 是否为URL
  exports.isURL = function (str) {
    var strReg = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var reg = new RegExp(strReg);
    return reg.test(str);
  };

});