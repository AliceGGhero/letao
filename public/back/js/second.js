/**
 * Created by ll on 2018/1/13.
 */
$(function(){
  var page = 1;
  var pageSize = 5;

  function render() {
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:page,
        pageSize: pageSize
      },
      success:function(info){
        //console.log(info);
        var result = template('tpl',info);
        $('tbody').html(result);
      }
    })
  };
  render();

  $('.btn_add').on('click',function(){
    $('#addModal').modal('show');

    //发送ajax请求，获取所有的一级分类的数据，渲染到下拉框
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        var result = template('menuTpl',info);
        $('.dropdown-menu').html(result);
      }
    })
  });

  //3. 下拉列表选中功能
  //3.1 给下拉列表中的a注册点击事件
  //3.2 获取点击的a标签的内容，设置给dropdown-text的内容
  $('.dropdown-menu').on('click','a',function(){
    $('.dropdown-text').text($(this).text());

    //获取id，把id赋值给categoryId的隐藏
    $('#categoryId').val($(this).data('id'));

    //手动把categoryId设置为VALID状态
    $form.data('bootstrapValidator').updateStatus('categoryId','VALID');
  });

  //4. 初始化文件上传功能
  $('#fileupload').fileupload({
    dataType:'json',
    done:function(e, data){
      console.log(data);
      //通过data.result可以获取到一个对象，这个对象的picAddr属性就是图片的地址
      //console.log(data.result.picAddr);
      $('.img_box img').attr('src',data.result.picAddr);
      $('#brandLogo').val(data.result.picAddr);
      $form.data('bootstrapValidator').updateStatus('brandLogo','VALID');
    }
  });

  //表单验证
  $form = $('form');
  $form.bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message:'一级分类不能为空'
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:'请输入品牌名称'
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:'请上传品牌logo'
          }
        }
      }
    }
  });

  //给表单注册校验成功事件
  $form.on('success.form.bv',function(e){
    e.preventDefault();
    //阻止默认行为
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:$form.serialize(),
      success:function(info){
        console.log(info);
        if(info.success){
          //隐藏模态框
          $('#addModal').modal('hide');
          page = 1;
          render();
          //重置表单样式
          $form.data('bootstrapValidator').resetForm(true);
          //
          $('.dropdown-text').text('请选择一级分类');
          $('.img_box img').attr('src','images/none.png');
        }
      }
    })
  });

});