/**
 * Created by ll on 2018/1/13.
 */
$(function(){
  var page = 1;
  var pageSize = 5;

  function render(){
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page: page,
        pageSize: pageSize
      },
      success:function(info){
        //console.log(info);
        var result = template('tpl',info);
        $('tbody').html(result);

        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total/ info.size),
          onPageClicked:function(a, b, c, p){
            page = p;
            render();
          }
        })
      }
    })
  };
  render();

  //添加分类功能
  $('.btn_add').on('click',function(){
    $('#addtModal').modal('show');
  });

  //表单验证功能
  var $form = $('#form');
  $form.bootstrapValidator({
    //配置校验时显示的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryName:{
        validators:{
          notEmpty:{
            message:"一级分类的名称不能为空"
          }

        }
      }
    }
  });

  //给表单注册校验成功的事件
  $form.on('success.form.bv',function(){
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data: $form.serialize(),
      success:function(info){
        //console.log(info);
        //关闭模态框
        $('#addtModal').modal('hide');
        page = 1;
        render();
        $form.data("bootstrapValidator").resetForm(true);
      }
    })
  })


});