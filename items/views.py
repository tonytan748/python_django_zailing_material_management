from functools import wraps

from django.shortcuts import render,render_to_response,redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse,HttpResponseRedirect,JsonResponse
from django.views.generic import ListView,DetailView

from django.contrib.auth.models import User
from django.contrib.auth import authenticate,logout
from django.contrib.auth import login as auth_login
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.db import transaction
from django.core import serializers
from django.http import StreamingHttpResponse

import json
import xlwt
import io
# from xlsxwriter.workbook import Workbook

from .models import *

from django.http import JsonResponse



def ajax_checking():
    def decorator(func):
        @wraps(func)
        def wrapper(request,*args,**kwargs):
            user = request.user
            print(user.id)
            # user = User.objects.filter(id=user_id).first()
            if not user:
                return JsonResponse({"status":"false","message":u"用户无权操作"})
            return func(request,*args,**kwargs)
        return wrapper
    return decorator

@ajax_checking()
def get_item(request):
    try:
        id = request.GET.get("id")
        item = list(Item.objects.filter(id=id).values())
        if item:
            return JsonResponse({"status":"true","message":u"查询成功","data":item})
        return JsonResponse({"status":"false","message":u"查询失败"})
    except Exception as e:
        return JsonResponse({"status":"false","message":str(e)})

@ajax_checking()
def ajax_item_add(request):
    add_value = request.GET.get('value')
    if add_value is None:
        return JsonResponse({"status":"false","message":u"数据错误"})
    try:
        add_value = int(add_value)
    except Exception as e:
        raise e
    pk = int(request.GET.get('id'))
    item = Item.objects.filter(pk=pk).first()
    if item:
        item.qty = item.qty + int(add_value)
        item.save()
        return JsonResponse({"status":"true","data":str(item.qty)})
    else:
        return JsonResponse({"status":"false","message":u"该物料不存在"})

@ajax_checking()
def ajax_item_out(request):
    pk = int(request.GET.get("id"))
    try:
        add_value = int(request.GET.get('value'))
    except:
        return JsonResponse({'status':'false','message':u"数据格式错误"})
    item = Item.objects.filter(pk=pk).first()
    if item:
        if item.qty < add_value:
            return JsonResponse({'status':'false','message':u"数据错误"})
        item.qty = item.qty - add_value
        item.save()
        return JsonResponse({'status':'true','data':str(item.qty)})
    return JsonResponse({'status':'false','message':u"该物料不存在"})


def login(request):
    errors = []
    username = None
    password = None
    if request.method == 'POST':
        if not request.POST.get('username'):
            errors.append(u'用户名为空')
        else:
            username = request.POST.get('username')
        if not request.POST.get('password'):
            errors.append(u'密码为空')
        else:
            password = request.POST.get('password')
        if username is not None and password is not None:
            user = authenticate(username=username,password=password)
            if user is not None:
                if user.is_active:
                    auth_login(request,user)
                    return redirect('/index/')
                else:
                    errors.append(u'登录失败请重试')
            else:
                errors.append(u'用户不存在')
    return render(request,'items/login.html',{'errors':errors})


def logout(request):
    logout(request)
    return HttpResponseRedirect('login')


@login_required(login_url='/login/')
def index(request):
    item_data = Item.objects.all().order_by('-created')
    paginator = Paginator(item_data, 100)
    page = request.GET.get('page')
    try:
        items = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        items = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        items = paginator.page(paginator.num_pages)

    user = request.user
    if user:
        pe = []
        for i in user.get_all_permissions():
            p = i.split('.')[1].split('_')
            m = (p[1],p[0])
            pe.append(m)
        perms = {}
        for k,v in pe:
            try:
                perms[k].append(v)
            except:
                perms[k] = [v]

    types = ItemType.objects.all()

    url = "items/index.html"
    # items = Item.objects.all()
    context = {
        "user_id":user.id,
        'user_perms':perms,
        "items":items,
        "title":u"物料管理",
        "types":types,
    }
    return render(request,url,context)

@login_required(login_url='/login/')
def bomlist(request):
    user = request.user
    bs = Bom.objects.filter(user=user)
    boms = [{"name":i.name,"id":i.pk} for i in bs]
    url = "items/bomlist.html"
    context = {
        "user_id":user.id,
        'title':u"BOM清单",
        "boms":boms,
    }
    return render(request,url,context)

@login_required(login_url='/login/')
def itemtype(request):
    user = request.user
    types_title = [u"类型名称",u"类型描述"]
    types= ItemType.objects.all().order_by('-id')
    url = "items/itemtype.html"
    context = {
        "user_id":user.id,
        "types_title":types_title,
        "types":types,
        "title":u"类型管理"
    }
    return render(request,url,context)


@login_required(login_url='/login/')
def item_search(request):
    if request.method == 'POST':
        data = request.POST.get("search_name")
        user_id = request.POST.get("user_id")
        res = Item.objects.filter(Q(ids__contains=data)|Q(modelname__contains=data))
        url = "/index/"
        context = {
            "user_id":user_id,
            "title":u"物料管理",
        }
        if res.exists():
            paginator = Paginator(res, 100)
            page = request.GET.get('page')
            try:
                items = paginator.page(page)
            except PageNotAnInteger:
                # If page is not an integer, deliver first page.
                items = paginator.page(1)
            except EmptyPage:
                # If page is out of range (e.g. 9999), deliver last page of results.
                items = paginator.page(paginator.num_pages)
            context["items"] = items
            return render(request,"items/index.html",context)
        else:
            return redirect(url)



def bom_item_search(request):
    data = request.GET.get("bom_item_search")
    items = list(Item.objects.filter(Q(ids__contains=data)|Q(modelname__contains=data)).values())
    if items:
        return JsonResponse({'status':'true','data':items})
    return JsonResponse({'status':'false','message':u"查询结果为空"})


@ajax_checking()
def create_new_item(request):
    user_id = request.POST.get('user_id')
    datas = request.POST.get('datas')
    datas = json.loads(datas)
    print(datas)
    if datas:
        it = Item.objects.filter(ids=datas.get("ids",None)).first()
        if it:
            print(it.pk)
            return JsonResponse({"status":"false","message":u"该物料已存在，请重新编号"})
        itemtype = ItemType.objects.filter(pk=datas.get("itemtype",None)).first()
        datas['itemtype'] = itemtype
        item = Item(**datas)
        item.save()
        return JsonResponse({'status':'true','message':u"新增成功",'id':item.pk})
    return JsonResponse({'status':'false','message':u"新增失败，请重试"})


@ajax_checking()
def create_new_type(request):
    # user_id = request.POST.get("user_id")
    data = request.POST.get("datas")
    data = json.loads(data)
    print(data)
    if data:
        try:
            type = ItemType.objects.filter(name = data.get("name", None)).first()
            if type:
                return JsonResponse({'status': "false", "message": u"该类型名称已存在，请重新输入"})
            type = ItemType(**data)
            type.save()
            return JsonResponse({'status': "true", "message": u"新增成功", "id": type.pk})
        except Exception as e:
            return JsonResponse({"status": "false", "message": str(e)})
    return JsonResponse({"status": "false", "message": u"数据为空，请重新填写"})


@ajax_checking()
def create_new_bom(request):
    user_id = request.POST.get("user_id")
    print(user_id)
    user = User.objects.get(pk=user_id)

    new_bom_name = request.POST.get("new_bom_name")
    new_bom_description = request.POST.get("new_bom_description")
    datas = request.POST.get("datas")
    datas = json.loads(datas)
    print(datas)
    if datas:
        try:
            new_bom = Bom(name=new_bom_name,user=user,description=new_bom_description)
            new_bom.save()
            for data in datas:
                item = Item.objects.filter(pk=data.get("id",None)).first()
                qty = data.get("qty",None)
                remark = data.get("remark",None)
                new_bom_list = BomList(bom=new_bom,item=item,qty=qty,remark=remark)
                new_bom_list.save()
            return JsonResponse({'status':'true',"message":u"操作完成",'id':new_bom.id})
        except Exception as e:
            print(e)
            return JsonResponse({'status':'false',"message":u"操作失败"})
    return JsonResponse({'status':'false',"message":u"没有数据"})


@ajax_checking()
def get_old_bom(request):
    bom_id = request.GET.get('bom_id')
    print(bom_id)
    bom = Bom.objects.filter(pk=bom_id).first()
    bom_list = BomList.objects.filter(bom=bom)
    if bom_list:
        bom_list = [{'id':i.id,'item_id':i.item.id,'ids':i.item.ids,'modelname':i.item.modelname,'potting':i.item.potting,'position':i.item.position,'description':i.item.description,'itemtype':i.item.itemtype.name,'price':i.item.price,'qty':i.item.qty,'markup':i.item.markup,'bom_qty':i.qty,'bom_remark':i.remark} for i in bom_list]
        return JsonResponse({'status':'true',"data":bom_list})
    else:
        return JsonResponse({'status':'false',"message":u"没有查找到物料"})

# 保存修改过的BOM
@ajax_checking()
def save_changed_bom(request):
    user_id = request.POST.get("user_id")
    user = User.objects.get(id=user_id)
    bom_id = request.POST.get("bom_id")
    bom = Bom.objects.filter(id=bom_id)
    if bom.exists():
        bom_items = BomList.objects.get(bom=bom)
        bom_items.delete()
        datas = request.POST.get("datas")
        for data in datas:
            bomlist = BomList(bom=bom,item=Item.objects.get(id=data.id),qty=data.qty,remark=data.remark)
            bomlist.save()
        return JsonResponse({'status':'true',"message":u"保存完成"})
    return JsonResponse({'status':'false',"message":u"没有查找到物料"})


# BOM名称搜索
@ajax_checking()
def bom_name_search(request):
    data = request.GET.get("bom_name_search")
    bs = list(Bom.objects.filter(name__contains=data).values())
    if bs:
        print(bs)
        for k,v in enumerate(bs):
            u = User.objects.get(id=v['user_id'])
            bs[k]['user_name'] = u.username
        return JsonResponse({"status":"true","data":bs})
    return JsonResponse({"status":"false","message":u"数据为空"})


@ajax_checking()
def delete_type(request):
    type_id = request.GET.get("type_id")
    print(type_id)
    if type_id:
        type = ItemType.objects.filter(id=int(type_id)).first()
        if type:
            type.delete()
            return JsonResponse({'status':'true','message':u"删除成功"})
        return JsonResponse({"status":"false","message":u"删除失败"})
    return JsonResponse({"status":"false","message":u"删除失败,没有数据"})


@ajax_checking()
def edit_item_type(request):
    data = request.POST.get('datas')
    data = json.loads(data)
    try:
        if data:
            id = data.get("id",None)
            name = data.get("name",None)
            description = data.get("description", None)
            itemtype = ItemType.objects.filter(id=id).update(name=name,description=description)
            if itemtype:
                return JsonResponse({"status":"true","message":u"保存完成"})
            else:
                return JsonResponse({"status": "false", "message": u"保存失败"})
        return JsonResponse({'status':'false','message':u"数据为空"})
    except:
        return JsonResponse({'status':'false', 'message':u"保存失败"})



# 数据导出为excel
# @login_required(login_url='/login/')
# def bom_export(request):
#     bom_id = request.POST.get('old_bom_names')
#     bom = Bom.objects.get(pk=bom_id)
#     if bom:
#         bom_list = BomList.objects.filter(bom=bom)
#         if bom_list.exists():
#             output = io.BytesIO()
#
#             # .. and pass it into the XLSXWriter
#             book = Workbook(output, {'in_memory': True})
#             sheet = book.add_worksheet(bom.name)
#             sheet.write(0, 0, bom.name)
#             for k,v in enumerate([u"编码",u"型号",u"封装",u"位号",u"描述",u"价格",u"数量",u"备注",u"BOM数量",u"BOM备注"]):
#                 sheet.write(1,k,v)
#             x = 2
#             for i in bom_list:
#                 sheet.write(x, 0, i.item.ids)
#                 sheet.write(x, 1, i.item.modelname)
#                 sheet.write(x, 2, i.item.potting)
#                 sheet.write(x, 3, i.item.position)
#                 sheet.write(x, 4, i.item.description)
#                 sheet.write(x, 5, i.item.price)
#                 sheet.write(x, 6, i.item.qty)
#                 sheet.write(x, 7, i.item.markup)
#                 sheet.write(x, 8, i.qty)
#                 sheet.write(x, 9, i.remark)
#                 x += 1
#             book.close()
#
#             output.seek(0)
#             response = HttpResponse(output.read(),content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
#             response['Content-Disposition'] = "attachment; filename={}.xlsx".format(bom.name)
#             return response
#     print(bom_id)
#     url = "items/bomlist.html"
#     return redirect('bomlist')
