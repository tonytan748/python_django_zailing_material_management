$(document).ready(function(){

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

  // 增加物料
  $("li #item_add").click(function(){
      var user_id = $(".user_id").val();
      // var user_id = $(this).parents(".input-group-btn").siblings(".user_id").val();
      var add_val = $(this).parents(".input-group-btn").siblings(".form-control");
      // var item_id = $(this).parents(".item").children("#ids");
      var item_id = $(this).parents(".item").children("#id").val();
      var original_val = $(this).parents(".item").children("#qty");
      var msg = $(this).parents(".item_data").siblings(".operation_msg").children("a");
      if (!isNaN( add_val.val() )==false || $.isNumeric( add_val.val() )==false )
      {
        msg.text("数据为空或非数字，请重试");
        add_val.focus();
        return false;
      };

      $.get("/ajax_item_add/",{"value":add_val.val(),"id":item_id,"user_id":user_id},function(data,status){
          if(status=="success"){
            if(data.status==false){
              msg.val(data.message);
              return false;
            }else{
              original_val.text(data.data);
              msg.text("入库成功,入库数量：" + add_val.val());
              add_val.val("");
            }
          }else{
            msg.text("抱歉，数据提交失败，请刷新重试");
          }
      });
  });

  // 领用物料
  $("li #item_out").click(function(){
    var user_id = $(".user_id").val();
    //  $(this).parents(".input-group-btn").siblings(".user_id").val();
    var add_val = $(this).parents(".input-group-btn").siblings(".form-control");
    // var item_id = $(this).parents(".item").children("#ids");
    var item_id = $(this).parents(".item").children("#id").val();
    var original_val = $(this).parents(".item").children("#qty");
    var msg = $(this).parents(".item_data").siblings(".operation_msg").children("a");
      if (!isNaN( add_val.val() )==false || $.isNumeric( add_val.val() )==false )
      {
        msg.text("数据为空或非数字，请重试");
        add_val.focus();
        return false;
      };
      if(parseInt(original_val.text()) < parseInt(add_val.val()))
      {
        msg.text("数量错误，请确认！");
        add_val.focus();
        return false;
      }

      $.get("/ajax_item_out/",{"value":add_val.val(),"id":item_id,"user_id":user_id},function(data,status){
          if(status=="success"){
            if (data.status==false){
              msg.text("抱歉，数据提交失败，请刷新重试");
              return false;
            }else{
              original_val.text(data.data);
              msg.text("领用成功,领用数量：" + add_val.val());
              add_val.val("");
            }
          }else{
            msg.text("抱歉，数据提交失败，请刷新重试");
          }

      });
  });


  //修改物料信息
  $('#EditItem').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var paret = button.parents(".item");
    // alert(paret.html());
    var id = paret.find("#id").val();
    var ids = paret.find("#ids").text();
    var description = paret.find("#description").text();
    var modelname = paret.find("#modelname").text();
    var potting = paret.find("#potting").text();
    var position = paret.find("#position").text();
    var itemtype = paret.find("#itemtype").text();
    var price = paret.find("#price").text();
    var qty = paret.find("#qty").text();
    var markup = paret.find("#markup").text();

    var recipient = button.data('whatever');
    var modal = $(this)
    modal.find("#edit_id").val(id);
    modal.find("#edit_ids").val(ids);
    modal.find("#edit_modelname").val(modelname);
    modal.find("#edit_potting").val(potting);
    modal.find("#edit_position").val(position);
    var count=$("#edit_itemtype").find("option").length;
    for(var i=0;i<count;i++){
      if($("#edit_itemtype").get(0).options[i].text == itemtype){
        $("#edit_itemtype").get(0).options[i].selected = true;
          break;
      }
    }
    modal.find("#edit_qty").val(qty);
    modal.find("#edit_price").val(price);
    modal.find("#edit_description").val(description);
    modal.find("#edit_markup").val(markup);

  })

  // bom物料搜索
  $("#bom_item_search_btn").click(function(){
    var data = $("#bom_item_search").val();
    var modal_body = $("#search_item_result");
    if(data.length == 0){
      $("#ItemSearch").modal('hide');
      alert("数据为空");
      return false;
    }
    $("#search_item_result").html("");
    $.get("/bom_item_search/",{"bom_item_search":data},function(data,status){
      if(status=="success"){
        if (data.status==false) {
          $("#ItemSearch").modal('hide');
          alert(data.message);
          return false;
        } else {

          $.each(data.data,function(i,item){
            $("#search_item_result").append("<tr id='search_item_tr'>"+
            "<td class='search_item_ids'><input type='hidden' value='" + item.id + "' class='search_item_id'>" + item.ids + "</td>"+
            "<td class='search_item_modelname'>" + item.modelname + "</td>"+
            "<td class='search_item_potting'>" + item.potting + "</td>"+
            "<td class='search_item_position'>" + item.position + "</td>"+
            "<td class='search_item_description'>" + item.description + "</td>"+
            "<td class='search_item_itemtype'>" + item.itemtype + "</td>"+
            "<td class='search_item_price'>" + item.price + "</td>"+
            "<td class='search_item_qty'>" + item.qty + "</td>"+
            "<td><input type='text' name='search_item_value' class='search_item_value'></td><td><input type='text' name='search_item_remark' class='search_item_remark'></td>"+
            "</tr>");
          });
        }
      }else {
        $("#ItemSearch").modal('hide');
        alert("抱歉，数据提交失败，请刷新重试");
        return false;
      }
    });
  });

  // 保存搜索的物料
  $("#bom_item_search_save").click(function(){
    var user_id = $(".user_id").val();
    var items = []
    $("#search_item_result>tr").each(function(){
      var item_id = $(this).find(".search_item_id").val();
      var item_ids = $(this).find(".search_item_ids").text();
      var item_modelname = $(this).find(".search_item_modelname").text();
      var item_potting = $(this).find(".search_item_potting").text();
      var item_position = $(this).find(".search_item_position").text();
      var item_description = $(this).find(".search_item_description").text();
      var item_itemtype = $(this).find(".search_item_itemtype").text();
      var item_price = $(this).find(".search_item_price").text();
      var item_instore = $(this).find(".search_item_qty").text();

      var item_val = $(this).find(".search_item_value").val();
      var remark_val = $(this).find(".search_item_remark").val();

      if(!isNaN( item_val )==true && $.isNumeric( item_val )==true){
        if(parseInt(item_val) > parseInt(item_instore)){
          alert("数量超出库存，请确认数量");
          return false;
        }
        var data = {
            item_id:item_id,
            item_ids:item_ids,
            item_modelname:item_modelname,
            item_potting:item_potting,
            item_position:item_position,
            item_description:item_description,
            item_itemtype:item_itemtype,
            item_price:item_price,
            item_instore:item_instore,
            qty:item_val,
            remark:remark_val,
        };
        items.push(data);
      }
    });

    if (items.length>0){
      for(var i=0;i<items.length;i++){
        $("#bom_item_list").append("<tr>"+
        "<td><input type='checkbox' class='selected_item' name='selected_item'>"+
          "<input type='hidden' class='bom_item_id'  value='" + items[i]["item_id"] + "'>"+
        "</td><td class='bom_item_ids'>" + items[i]["item_ids"] + "</td><td>" + items[i]["item_modelname"] + "</td>"+
        "<td>" + items[i]["item_potting"] + "</td>"+
        "<td>" + items[i]["item_position"] + "</td>"+
        "<td>" + items[i]["item_description"] + "</td>"+
        "<td>" + items[i]["item_itemtype"] + "</td>"+
        "<td>" + items[i]["item_price"] + "</td>"+
        "<td class='item_qty'>" + items[i]["item_instore"] + "</td>"+
        "<td><input type='text' name='operate_qty' class='bom_item_qty' value='" + items[i]["qty"] + "'></td>"+
        "<td><input type='text' name='bom_item_remark' class='bom_item_remark' value='" + items[i]["remark"] + "'></td>"+
        "</tr>");
      }
      $("#ItemSearch #bom_search_item_close_btn").click();

    }else{
      alert("没有键入数量");
    }
  });


//删除BOM临时表物料项
$("#delete_bom_temp_list").click(function(){
  var user_id = $(".user_id").val();
  var ids = new Array();
  $("input[name='selected_item']:checked").each(function(){
    var id = $(this).parents("tr").find(".bom_item_ids").text();
    ids.push(id);
  });
  if(ids.length==0){
    alert("没有选择要删除的数据，请重试！");
    return false;
  }
  $("input[name='selected_item']:checked").each(function(){
      var id = $(this).parents("tr").remove();
  });

});


//保留选择项
$("#confirm_bom_temp_list").click(function(){
  var user_id = $(".user_id").val();
  var ids = new Array();
  $("input[name='selected_item']:checked").each(function(){
    var qty = $(this).parents("tr").find(".bom_item_qty").val();
    var stock = $(this).parents("tr").find(".item_qty").text();
    if (parseInt(qty) > parseInt(stock)){
      alert("数量超出库存，请确认数量");
      return false;
    }
    var id = $(this).parents("tr").find(".bom_item_id").val();
    ids.push(id);
  });
  if(ids.length==0){
    alert("没有选择要筛选的数据，请重试！");
    return false;
  }
  $("input[name='selected_item']:not(:checked)").each(function(){
      var id = $(this).parents("tr").remove();
    });

});

//Bom物料全选
$("#bom_item_list_select_all").click(function(){
  var select_text = $("#bom_item_list_select_all").text();
  if (select_text=="全选"){
    $(".selected_item").prop("checked",true);
    $("#bom_item_list_select_all").text("全不选");
  }else{
    $(".selected_item").prop("checked",false);
    $("#bom_item_list_select_all").text("全选");
  }
});


$('#new_bom_description').val("");
//新建bom表
$("#create_new_bom").click(function(){

  var new_bom_name = $("#new_bom_name").val();
  var new_bom_description = $("#new_bom_description").val();
  if(!isNaN(new_bom_name)==true){
    alert("请输入BOM表名");
    return false;
  }

  $(".old_bom_names").each(function(){
    if($(this).children(".bom_name").text()==new_bom_name){
      alert("BOM名称已存在");
      return false;
    }
  });

  var user_id = $(".user_id").val();

  var items = new Array();
  $("input[name='selected_item']").each(function(){
    var qty = $(this).parents("tr").find(".bom_item_qty").val();
    var stock = $(this).parents("tr").find(".item_qty").text();
    if (parseInt(qty) > parseInt(stock)){
      alert("数量超出库存，请确认数量");
      return false;
    }
    var id = $(this).parents("tr").find(".bom_item_id").val();
    var remark = $(this).parents("tr").find(".bom_item_remark").val();
    var item = {id:id,qty:qty,remark:remark}
    items.push(item);
  });
  if(items.length==0){
    alert("没有选择数据，请重试！");
    return false;
  }
  var datas = JSON.stringify(items);

  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });

  $.ajax({
    url:"/create_new_bom/",
    data:{"datas":datas,
    "user_id":user_id,
    "new_bom_name":new_bom_name,
    "new_bom_description":new_bom_description,
},
    type:"POST",
    success:function(data){
      if(data.status==false){
        alert(data.message);
        return false;
      }else{
        alert(data.message);
        //是否保留临时清单
        $("#bom_item_list").each(function(){
          $(this).remove();
        });

        $(".old_bom_names").prepend('<option class="bom_name" value="' + data.id + '">' + new_bom_name + '</option>');
      }
    }
  });

});


//bom表查看
$("#bom_item_view").click(function(){
  var user_id = $(".user_id").val();
  var bom_id = $(".old_bom_names").val();
  if(!bom_id){
    alert("请选择BOM单号");
    return false;
    }
  $.get('/get_old_bom/',{'bom_id':bom_id,"user_id":user_id},function(data,status){
      if(status=="success"){
        if(data.status==false){
          alert(data.message);
          return false;
        }else{
          var datas = data.data;
          $("#bom_item_list").html("");

          $.each(datas,function(i,bom_list){
            $("#bom_item_list").append(
              "<tr>"+
              "<td><input type='checkbox' class='selected_item' name='selected_item'>"+
              "<input type='hidden' class='bom_item_id'  value='" + bom_list.id + "'></td>"+
              "<td class='bom_item_ids'>" + bom_list.ids + "</td>"+
              "<td>" + bom_list.modelname + "</td>"+
              "<td>" + bom_list.potting + "</td>"+
              "<td>" + bom_list.position + "</td>"+
              "<td>" + bom_list.description + "</td>"+
              "<td>" + bom_list.itemtype + "</td>"+
              "<td>" + bom_list.price + "</td>"+
              "<td class='item_qty'>" + bom_list.qty + "</td>"+
              "<td><input type='text' name='operate_qty' class='bom_item_qty' value='" + bom_list.bom_qty + "'></td>"+
              "<td><input type='text' name='bom_item_remark' class='bom_item_remark' value='" + bom_list.bom_remark + "'></td>"+
              "</tr>");
            });
        }
      }else{
        alert("操作失败，请重试");
      }
    });

  });


//保存修改按钮
$("#save_changed_bom").click(function(){
  var user_id = $(".user_id").val();

  var items = new Array();
  $("input[name='selected_item']:checked").each(function(){
    var qty = $(this).parents("tr").find(".bom_item_qty").val();
    var stock = $(this).parents("tr").find(".item_qty").text();
    if (parseInt(qty) > parseInt(stock)){
      alert("数量超出库存，请确认数量");
      return false;
    }
    var id = $(this).parents("tr").find(".bom_item_id").val();
    var remark = $(this).parents("tr").find(".bom_item_remark").val();
    var item = {id:id,qty:qty,remark:remark}
    items.push(item);
  });
  if(items.length==0){
    alert("没有选择数据，请重试！");
    return false;
  }

  var bom_id = $(".old_bom_names").val();
  var datas = JSON.stringify(items);
  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });

  $.ajax({
    url:"/save_changed_bom/",
    data:{"datas":datas,
    "user_id":user_id,
    "bom_id":bom_id},
    type:"POST",
    success:function(data){
      if(data.status==false){
        alert(data.message);
        return false;
      }else{
        alert(data.message);
      }
    }
  });

});


// bom名称搜索
$("#bom_name_search_btn").click(function(){
  var user_id = $(".user_id").val();
  var data = $("#bom_name_search").val();
  if(data.length == 0){
    $("#BomSearch").modal('hide');
    alert("数据为空");
    return false;
  }
  $("#search_bom_result").html("");
  $.get("/bom_name_search/",{"bom_name_search":data,"user_id":user_id},function(data,status){
    if(status=="success"){
      if (data.status==false) {
        $("#BomSearch").modal('hide');
        alert(data.message);
        return false;
      } else {

        $.each(data.data,function(i,result){
          $("#search_bom_result").append("<tr id='search_bom_tr'><td>           <input type='hidden' value='" + result.id + "'><input type='radio' name='search_bom_name' id='search_bom_name' autocomplete='off' value='" + result.id + "'>" + result.name + "</td><td>" + result.user_name + "</td><td>" + result.created + "</td><td>" + result.description + "</td></tr>");
        });
      }
    }else {
      $("#BomSearch").modal('hide');
      alert("抱歉，数据提交失败，请刷新重试");
      return false;
    }
  });
});

//BOM搜索结果选择后展示
$("#bom_item_view_2").click(function(){
  var user_id = $(".user_id").val();
  var bom_id = $("#search_bom_result input[name='search_bom_name']:checked").val();
  alert(bom_id);
  if(bom_id.length == 0){
    alert("没有选择BOM");
    return false;
  }
  $.get('/get_old_bom/',{'bom_id':bom_id,"user_id":user_id},function(data,status){
      if(status=="success"){
        if(data.status==false){
          alert(data.message);
          return false;
        }else{
          var datas = data.data;
          $("#BomSearch").modal('hide');
          $("#bom_item_list").html("");
          $.each(data.data,function(i,item){
            $("#bom_item_list").append("<tr>"+
            "<td><input type='checkbox' class='selected_item' name='selected_item'>"+
              "<input type='hidden' class='bom_item_id'  value='" + item.id + "'>"+
            "</td>"+
            "<td class='bom_item_ids'>" + item.ids + "</td><td>" + item.modelname + "</td>"+
            "<td>" + item.potting + "</td>"+
            "<td>" + item.position + "</td>"+
            "<td>" + item.description + "</td>"+
            "<td>" + item.itemtype + "</td>"+
            "<td>" + item.price + "</td>"+
            "<td class='item_qty'>" + item.qty + "</td>"+
            "<td><input type='text' name='operate_qty' class='bom_item_qty' value='" + item.bom_qty + "'></td>"+
            "<td><input type='text' name='bom_item_remark' class='bom_item_remark' value='" + item.bom_remark + "'></td>"+
            "</tr>");
            });
            $(".old_bom_names").val(item.id);
        }
      }else{
        alert("操作失败，请重试");
      }
    });
  });


$("#id_description").val("");
$("#id_markup").val("");

function check_add_item_table(){
  var ids = $("#id_ids").val();
  var modelname = $("#id_modelname").val();
  var potting = $("#id_potting").val();
  var position = $("#id_position").val();
  var itemtype = $("#id_itemtype").val();
  var qty = $("#id_qty").val();
  var price = $("#id_price").val();
  var description = $("#id_description").val();
  var markup = $("#id_markup").val();

  if(!isNaN(ids)==true){
    $(".id_ids_msg").children("a").text("请输入编码数据");
    return false;
  }
  if(!isNaN(modelname)==true){
    $(".id_modelname_msg").children("a").text("请输入型号数据");
    return false;
  }
  if(!isNaN(potting)==true){
    $(".id_potting_msg").children("a").text("请输入封装数据");
    return false;
  }
  if(!isNaN(position)==true){
    $(".id_position_msg").children("a").text("请输入位号数据");
    return false;
  }
  // if(!isNaN(itemtype)==true){
  //   $(".id_itemtype_msg").children("a").text("请选择类型数据");
  //   return false;
  // }
  if($.isNumeric(qty)==false){
    $(".id_qty_msg").children("a").text("请输入数量");
    return false;
  }
  if($.isNumeric(price)==false){
    $(".id_price_msg").children("a").text("请输入单价数据");
    return false;
  }
  var data = {
    ids:ids,
    modelname:modelname,
    potting:potting,
    position:position,
    itemtype:itemtype,
    qty:qty,
    price:price,
    description:description,
    markup:markup,
  };
  return data;
};

  //新增物料
  $("#create_new_item").click(function(){
    var data = check_add_item_table();
    if(data == false){
      return false;
    }

    var user_id = $(".user_id").val();
    var datas = JSON.stringify(data);
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    alert(data.ids);
    $.ajax({
      url:"/create_new_item/",
      data:{
        "datas":datas,
        "user_id":user_id},
      type:"POST",
      success:function(res){
        if(res.status==false){
          alert(res.message);
          return false;
        }else{
          alert(res.message);
          $("#item_list").prepend(""+
              "<tr class='item'>"+
                "<input type='hidden' value='" + res.id + "' id='id'>"+
                "<td id='ids'>" + data.ids + "</td>"+
                "<td>" + data.description + "</td>"+
                "<td>" + data.modelname + "</td>"+
                "<td>" + data.potting + "</td>"+
                "<td>" + data.position + "</td>"+
                "<td>" + data.price + "</td>"+
                "<td id='qty'>" + data.qty + "</td>"+
                "<td>" + data.markup + "</td>"+
                "<td class='col-lg-2'>" +
                  "<div class='input-group item_data'>"+
                    "<input type='text' name='operate_qty' class='form-control' aria-label='请输入操作数量'>"+
                    "<input type='hidden' name='user_id' class='user_id' value='" + user_id + "'>"+
                    "<div class='input-group-btn'><button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>操作 <span class='caret'></span></button>"+
                    "<ul class='dropdown-menu dropdown-menu-right'>"+
                      "<li><a id='item_out'>领用</a></li>"+
                      "<li><a id='item_add'>入库</a></li>"+
                    "</ul>"+
                    "</div>"+
                  "</div>"+
                  "<div class='operation_msg'><a style='color:red;' id='msg'></a></div>"+
                "</td>"+
              "</tr>");
          $("#CreateItem").modal('hide');
          alert(res.message);
        }
      }
    });

  });



$("#itemtype_description").val("");
$("#create_new_type").click(function(){
  var user_id = $(".user_id").val();
  var type_name = $("#itemtype_name").val();
  var type_description = $("#itemtype_description").val();
  if(isNaN(type_name)==false){
    $("#type_name_msg").text("请输入类型名称");
    return false;
  }
  if(isNaN(type_description)==false){
    $("#type_description_msg").text("请输入类型描述");
    return false;
  }
  var data = {
    name:type_name,
    description:type_description,
  }
  var datas = JSON.stringify(data);

  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });
  alert(datas);
  $.ajax({
    url:"/create_new_type/",
    data:{
      "datas":datas,
      "user_id":user_id},
    type:"POST",
    success:function(data){
      if(data.status==false){
        alert(data.message);
        return false;
      }else{
        $("#id_itemtype").prepend("<option value=" + data.id + " selected >" + type_name + "</option>")
        alert(data.message);
      }
    }
  });
});


  $("#create_new_itemtype").click(function () {
    var name = $("#itemtype_name").val();
    var description = $("#itemtype_description").val();
    if (name==""){
      $("#type_name_msg").text("请输入类型名称");
      return false
    }
    var data = {name:name,description:description};
    var datas = JSON.stringify(data);
    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      }
    });
    $.ajax({
      url:"/create_new_type/",
      data:{
        "datas":datas,
      },
      type:"POST",
      success:function(res){
        if(res.status==false){
          alert(res.message);
          return false;
        }else{
          $("#type_list").prepend("<tr class='type'>"+
              "<input type='hidden' value='"+ res.id +"' id='id'>"+
              "<td id='ids'>"+ name +"</td>"+
              "<td>"+ description +"</td>"+
              "<td class='col-lg-3'>"+
              "<p>"+
                "<button type='button' class='btn btn-primary' id='edit_item_type'>编辑</button>"+
                "<button type='button' class='tn btn-primary' id='delete_item_type'>删除</button>"+
              "</p>"+
              "</td>"+
              "</tr>");
          alert(res.message);
        }
      }
    });

  });

  $(".delete_type_btn").click(function () {
    var type_id = $(this).parents(".type").find("#id").val();
    var parent_element = $(this).parents(".type");
    $.get('/delete_type/',{'type_id':type_id},function(res,status){
      if(status=="success"){
        if(res.status==false){
          alert(res.message);
          return false;
        }else{
          parent_element.remove();
          alert(res.message);
        }
      }else{
        alert("操作失败，请重试");
      }
    });
  });


  $('#EditType').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var type_id = button.parents('.type').find("#id").val();
    var name = button.parents('.type').find("#name").text();
    var description = button.parents('.type').find("#description").text();

    var modal = $(this)
    modal.find("#edit_itemtype_id").val(type_id);
    modal.find("#edit_itemtype_name").val(name);
    modal.find("#edit_itemtype_description").val(description);
  })


  $("#edit_item_type").click(function () {
    var id = $("#edit_itemtype_id").val();
    var name = $("#edit_itemtype_name").val();
    var description = $("#edit_itemtype_description").val();
    if (id==""){
      $("#edit_type_id_msg").text("ID为空");
      return false;
    }
    if(name==""){
      $("#edit_type_name_msg").text("请输入类型名称");
      return false;
    }

    var data = {id:id,name:name,description:description};
    var datas = JSON.stringify(data);

    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      }
    });

    $.ajax({
      url:"/edit_item_type/",
      data:{
        "datas":datas
      },
      type:"POST",
      success:function(res){
        if(res.status==false){
          alert(res.message);
          return false;
        }else{
          $("#type_list>tr").each(function(i,item){
            var theid = $(this).find("#id");
            if(theid.val()==id){
              theid.siblings("#name").text(name);
              theid.siblings("#description").text(description);
              return false;
            }
          });
          $("#EditType").modal('hide');
          alert(res.message);
        }
      }
    });

  });


});
