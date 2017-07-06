define(function (require, exports, module) {
  var $ = require('jquery');
  var common = require('common');
  var tool = require('tool');
  // var template = require('template');
  // var api = require('api');
  var extend = require('extend');

  $(function () {
    /*$(".countchars").each(function(){       //循环选中的countchars类中的元素
      var length = $(this).val().length;   //得到控年的值的长度，也就是字符长度
      $(this).parent().find('#charlength').html('<b>'+length+'</b>'); //显示字符个数
      $(this).keyup(function(){                                      //为其关联keyup事件
        var new_length = $(this).val().length;                      //得到新长度
        $(this).parent().find('#charlength').html('<b>'+new_length+'</b>'); //显示新的长度
        if (new_length>= "14") {                                   //如果字符个数大于140
          alert('已超过最大字符')
        }
      });
    });*/


    $('#btn-submit').click(function () {
        // tool.alert("添加成功！");
        /*tool.confirm('标题','确定要删除主题吗？',function () {
          console.log('已经删除!');
        });*/
        /*var elem=$('#popup');
        tool.popup(elem);

        $('#btn-cancel-add').click(function () {
          dialog.getCurrent().close();
        });*/
      /*var elem=$('#bubble')[0];
      tool.bubble('nihao',elem)*/

      console.log($("#form").serializeArray());


    });

  });

});
