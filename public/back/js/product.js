/**
 * Created by ll on 2018/1/14.
 */
$(function(){

  var page = 1;
  var pageSize = 5;
  var imgArr = [];//用来存储图片
  function render(){
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page: page,
        pageSize: pageSize
      },
      success:function(info){
        //console.log(info);
        $('tbody').html(template('tpl', info));

        //分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages:Math.ceil(info.total / info.size),

          //type: 具体的页码，返回page  首页-->first  上一页-->prev  下一页-->next  最后一页-->last
          //这个函数的返回值，就是按钮的内容
          itemTexts: function (type, page, current) {
            //根据type的不同，返回不同的字符串
            //console.log(type, page, current);
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
            //return 111;
          },
          tooltipTitles: function (type, page, current) {
            //根据type的不同，返回不同的字符串
            //console.log(type, page, current);
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "去第"+page+"页";
            }
            //return 111;
          },
          useBootstrapTooltip:true,//使用boostrap的tooltip
          onPageClicked:function(a, b, c, p){
            page = p;
            render();
          }
        })
      }
    })
  };
  render();

  $('tbody').on('click','.btn',function(){
    //console.log('e');
    $('#uploadModal').modal('show');
    var id = $(this).parent().data('id');
    console.log(id);
    var isupload = $(this).hasClass('btn-success')? 1:0;
  });

  //模态框
  $('.btn_add').on('click',function(){
    $('#addModal').modal('show');


    //渲染下拉菜单
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page: page,
        pageSize: pageSize
      },
      success: function(info) {
        $('.dropdown-menu').html(template('menuTpl', info));

      }
    })
  });

  //给下拉菜单的a标签添加点击事件
  $('.dropdown-menu').on('click','a',function(e){
    e.preventDefault();
    $('.dropdown-text').text($(this).text());
    $('#brandId').val($(this).data('id'));

    $form.data('bootstrapValidator').updateStatus('brandId','VALID');

  });

  //初始化上传插件
  $('#fileupload').fileupload({
    dataType:'json',
    done:function(e, data){
      //console.log(data);
      if(imgArr.length >= 3){
        return;
      }
      $('.img_box').append('<img src="'+ data.result.picAddr +'" width="100" height="100" alt="">');

      imgArr.push(data.result);
      console.log(imgArr);

      //根据数组的长度，对productLogo进行校验
      if(imgArr.length == 3){
        $form.data('bootstrapValidator').updateStatus('productLogo','VALID');
      }else{
        $form.data('bootstrapValidator').updateStatus('productLogo','INVALID');
      }
    }
  });




  //表单验证
  var $form = $('#form');
  $form.bootstrapValidator({
    //配置隐藏内容效验
    excluded:[],
    //配置校验时显示的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      brandId:{
        validators:{
          notEmpty:{
            message:'二级分类不能为空'
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:'商品名称不能为空'
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:'商品描述不能为空'
          }
        }
      },
      num:{
        validators:{
          notEmpty:{
            message:'商品库存不能为空'
          },
          regexp:{
            regexp:/^[1-9]\d*$/,
            message:'请输入合法库存'
          }
        }
      },
      size:{
        validators:{
          notEmpty:{
            message:'商品尺寸不能为空'
          },
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:'请输入合法的尺码，比如(32-44)'
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:"商品原价不能为空"
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:"商品价格不能为空"
          }
        }
      },
      productLogo:{
        validators:{
          notEmpty:{
            message:"请上传3张图片"
          }
        }
      },
    }
  });

  //表单注册成功事件
  $form.on('success.form.bv',function(e){
    e.preventDefault();

    var param = $form.serialize();

    //拼接上数组中picName和picAddr

    param += '&picName='+ imgArr[0].picName + '&picAddr='+ imgArr[0].picAddr;
    param += '&picName='+ imgArr[1].picName + '&picAddr='+ imgArr[1].picAddr;
    param += '&picName='+ imgArr[2].picName + '&picAddr='+ imgArr[2].picAddr;

    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:param,
      success:function(info){
        //隐藏模态框
        $('#addModal').modal('hide');
        //重新渲染
        page = 1;
        render();
        //重置表单
        $form.data('bootstrapValidator').resetForm(true);
        $('.dropdown-text').text('请选择二级分类');
        $('.img_box img').remove();
        //图片自杀
        //清空数组
        imgArr = [];
      }
    })
  });

});