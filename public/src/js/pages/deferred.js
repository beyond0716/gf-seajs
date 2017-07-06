define(function (require, exports, module) {
  var $ = require('jquery');

  var wait = function(){
    var tasks = function(){
      alert("执行完毕！");
    };
    setTimeout(tasks,5000);
  };

  var dtd = $.Deferred(); // 新建一个deferred对象
  var wait_dtd = function(dtd){
    var tasks = function(){
      alert("执行完毕！");
      // dtd.resolve(); // 改变deferred对象的执行状态
      dtd.reject(); // 改变Deferred对象的执行状态
    };
    setTimeout(tasks,5000);
    return dtd;
  };
  // dtd.resolve();

  var wait_dtd_promise = function(dtd){
    var tasks = function(){
      alert("执行完毕！");
      dtd.resolve(); // 改变Deferred对象的执行状态
    };

    setTimeout(tasks,5000);
    return dtd.promise(); // 返回promise对象
  };
  // var d=wait_dtd_promise(dtd);

  var wait_dtd_inner = function(dtd){
    var dtd = $.Deferred(); //在函数内部，新建一个Deferred对象
    var tasks = function(){
      alert("执行完毕！");
      dtd.resolve(); // 改变Deferred对象的执行状态
    };

    setTimeout(tasks,5000);
    return dtd.promise(); // 返回promise对象
  };

  function ajaxA() {
    $.ajax({
      url: "test.html",
      success: function () {
        alert("成功啦！");
      },
      error: function () {
        alert("出错啦！");
      }
    });
  }

  function ajaxB() {
    $.ajax("test.html")
      .done(function () {
        alert("成功啦！");
      })
      .fail(function () {
        alert("出错啦！");
      });
  }

  function ajaxC() {
    $.ajax("test.html")
      .done(function () {
        alert("成功啦！");
      })
      .fail(function () {
        alert("出错啦！");
      })
      .done(function () {
        alert("第二个回调函数！");
      });
  }

  function ajaxD() {
    $.when($.ajax("test.html"), $.ajax("plugins.html"))
      .done(function () {
        alert("成功啦！");
      })
      .fail(function () {
        alert("出错啦！");
      });
  }

  function ajaxE() {
    $.when(wait())
      .done(function(){ alert("成功啦！"); })
      .fail(function(){ alert("出错啦！"); });
  }

  function ajaxF() {
    $.when(wait_dtd(dtd))
      .done(function(){ alert("成功啦！"); })
      .fail(function(){ alert("出错啦！"); });
  }

  function ajaxG() {
    $.when(d)
      .done(function(){ alert("成功啦！"); })
      .fail(function(){ alert("出错啦！"); });
  }
  // d.resolve(); // 此时，这个语句是无效的

  function ajaxH() {
    $.when(wait_dtd_inner())
      .done(function(){ alert("成功啦！"); })
      .fail(function(){ alert("出错啦！"); });
  }

  function ajaxI() {
    $.Deferred(wait)
      .done(function(){ alert("成功啦！"); })
      .fail(function(){ alert("出错啦！"); });
  }

  /*function ajaxJ() {
    dtd.promise(wait);
    wait.done(function(){ alert("成功啦"); })
      .fail(function(){ alert("出错啦！"); });
    wait(dtd);
  }*/

  /**
   * 发送api请求
   */
  function sendReq(url, data, successcall, failcall, opt) {
    opt = $.extend({}, {
      url: url,
      data: data,
      type: 'post',
      async: true,
      success: function (rsp) {
        if (rsp) {
          //服务器正常返回
          var json = null;
          try {
            json = rsp;
            if (validRes(json)) {
              if (successcall) {
                successcall(json);
                return;
              }
            } else {
              if (failcall) {
                failcall(json);
              }
            }
          } catch (ex) {
            //todo: 上传错误到服务器
          }
        }
      },
      error: function (xhr, status) {
        if (failcall) {
          failcall(null, status);
        }
      }
    }, opt);
    var ajax = $.ajax(opt);
    return ajax;
  }

  /**
   * 新建API
   */
  function buildAPI(url, defaultData, defaultOpt) {
    return function (data, success, error, opt) {
      opt = defaultOpt ? $.extend({}, defaultOpt, opt) : opt;
      data = defaultData ? $.extend({}, defaultData, data) : data;
      return sendReq(url, data, success, error, opt);
    };
  }

  function outer(a, b) {
    return function () {
      return a+b;
    };
  }

  var getAjax= function (url,type) {
    type=type||'GET';
    return function (data,success,options) {
      if(utils.isFunction(arguments[0])){
        success=arguments[0];
        options=arguments[1];
        data={};
      }
      options= $.extend(true,{},defaults,{url:url,type:type,data:data,success:success},options);
      $.ajax(options);
    };
  };

  function get(url) {
    return getAjax(url,"GET");
  }

  function alertObj(obj){
    var output = "";
    for(var i in obj){
      var property=obj[i];
      output+=i+" = "+property+"\n";
    }
    alert(output);
  }

  function displayProp(obj){
    var names="";
    for(var name in obj){
      if(typeof obj[name] == "object"){
        names+="{"+displayProp(obj[name])+"}, ";
      }else{
        names+=name+": "+obj[name]+", ";
      }
    }
    return names;
  }
  function print(x)
  {document.write(x+"<br/>");}

  $(function () {
    // ajaxA();
    // ajaxB();
    // ajaxC();
    // ajaxD();
    // ajaxE();
    // ajaxF();
    // ajaxG();
    // ajaxH();
    // ajaxI();
    // ajaxJ()
    // var aa=buildAPI("aa",{},{"ddd":"dffd"})
    // alert(aa);
    // alert(outer(2,3))
    // alert(getAjax('aa',"GET"));
    // alert(get("sdds"));

    var result=$.extend( true,  {},
      { name: "John", location: {city: "Boston",county:"USA"} },
      { last: "Resig", location: {state: "MA",county:"China"} } );
    print(displayProp(result));
  });
});
