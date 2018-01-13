/**
 * Created by ll on 2018/1/11.
 */

$(function () {

  //表单验证
  $("form").bootstrapValidator({
    message: 'This value is not valid',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    fields:{
      username: {
        message: '用户名验证失败',
        validators: {
          notEmpty: {
            message: '用户名不能为空'
          },
          stringLength: {
            min: 4,
            max: 18,
            message: '用户名长度必须在4到18位之间'
          },
          //regexp: {
          //  regexp: /^[a-zA-Z0-9_]+$/,
          //  message: '用户名只能包含大写、小写、数字和下划线'
          //},
          callback:{
            message:"用户名不存在"
          }
        }
      },

      password: {
        validators: {
          notEmpty: {
            message: '密码不能为空'
          },
          stringLength: {
            min: 6,
            max: 12,
            message: '密码必须是6-12位'
          },
          callback:{
            message:"密码不正确"
          }
        }
      }
    }
  });

  //表单注册效验成功事件.效验成功会触发：success.form.bv
  $("form").on('success.form.bv',function(e){
    //组织表单提交
    e.preventDefault();
    //发送ajax请求
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data:$('form').serialize(),
      success:function(info){
        //登陆成功
        if(info.success) {
          location.href = "index.html";
        }

        //登录失败
        if(info.error === 1000) {
          //使用updateStatus方法，把用户名改成失败即可
          // $form.data("bootstrapValidator") 用于获取插件实例，通过这个实例可以调用方法
          //3个参数：
          //1. 字段名，，，，，username
          //2. 状态  ： VALID   INVALID
          //3. 显示哪个校验的内容
          $('form').data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }

        if(info.error === 1001){
          $('form').data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
      }
    })

  })
});
