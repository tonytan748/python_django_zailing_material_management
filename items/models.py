from django.db import models
import os
import binascii
from django.contrib.auth.models import User
from django.utils.encoding import python_2_unicode_compatible

class ItemType(models.Model):
    name = models.CharField(u"名称",max_length=200)
    description = models.TextField(u"描述",blank=True,null=True)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = u"物料类型"
        verbose_name_plural = u"物料类型"


class City(models.Model):
    name = models.CharField(u"地区", max_length=20)
    remark = models.TextField('描述', blank=True, null=True)

    def __str__(self):
        return self.name
    class Meta:
        verbose_name = '地区'
        verbose_name_plural = '地区'

class Office(models.Model):
    name = models.CharField('办公室', max_length=20)
    city = models.ForeignKey(City)
    remark = models.TextField('描述', blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '办公室'
        verbose_name_plural = '办公室'

# class User(models.Model):
#     name = models.CharField("用户名",max_length=100)
#     password = models.CharField("密码",max_length=200)
#     permission = models.CharField("权限",max_length=200)
#     def __str__(self):
#         return self.name


class UserCity(models.Model):
    user = models.ForeignKey(User)
    city = models.ForeignKey(City)

    def __str__(self):
        return "{}_{}".format(self.user.username, self.city.name)
    class Meta:
        verbose_name = '用户地区权限'
        verbose_name_plural = '用户地区权限'


class UserAction(models.Model):
    user = models.ForeignKey(User)
    action_perm = models.IntegerField('是否有操作权限', choices=((0,"否"),(1,"是")), default=0)
    def __str__(self):
        return '{}_{}'.format(self.user.username, self.action_perm)

    class Meta:
        verbose_name = '是否操作权限'
        verbose_name_plural = '是否操作权限'


@python_2_unicode_compatible
class Item(models.Model):
    ids = models.CharField(u"编码",max_length=200)
    name = models.CharField("名称", max_length=200, blank=True, null=True)
    modelname = models.CharField(u"型号",max_length=200,blank=True,null=True)
    city = models.ForeignKey(City)
    office = models.ForeignKey(Office, blank=True, null=True)
    itemtype = models.ForeignKey(ItemType,blank=True,null=True)
    qty = models.IntegerField(u"数量",default=1)
    price = models.FloatField(u"单价",default=0.0)

    buy_time = models.DateField('购买时间', blank=True, null=True)
    on_user = models.CharField("责任人", max_length=20, blank=True, null=True)
    use_date = models.DateField('领用时间', blank=True, null=True)
    remark = models.TextField('备注', blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)

    potting = models.CharField(u"封装",max_length=100,blank=True,null=True)
    position = models.CharField(u"位号",max_length=100,blank=True,null=True)
    description = models.TextField(u"描述",null=True,blank=True)
    markup = models.TextField(u"备注",null=True,blank=True)
#    image = models.ImageField(null=True)
    def __str__(self):
        return self.ids

    class Meta:
        verbose_name = u"物料"
        verbose_name_plural = u"物料"



@python_2_unicode_compatible
class InOut(models.Model):
    item = models.ForeignKey(Item,on_delete=models.CASCADE,)
    qty = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User)
    TRANSFER = ((1,'IN'),(0,'OUT'))
    status = models.CharField(max_length=2,choices=TRANSFER,default=1)
    bom = models.CharField("BOM号码",max_length=50,null=True,blank=True)

    def __str__(self):
        return "{}-{}-{}".format(self.item.name,self,qty,self.status)

    class Meta:
        ordering = ['created']
        verbose_name = u"进出明细"
        verbose_name_plural = u"进出明细"

@python_2_unicode_compatible
class Bom(models.Model):
    name = models.CharField(u"BOM名称",max_length=100)
    user = models.ForeignKey(User)
    created = models.DateTimeField(auto_now_add=True)
    description = models.TextField(u"描述",blank=True,null=True)

    def __str__(self):
        return self.name
    class Meta:
        verbose_name = u"BOM单"
        verbose_name_plural = u"BOM单"

@python_2_unicode_compatible
class BomList(models.Model):
    bom = models.ForeignKey(Bom)
    item = models.ForeignKey(Item)
    qty = models.IntegerField(u"数量",default=0)
    remark = models.CharField(u"备注",max_length=250,blank=True,null=True)

    def __str__(self):
        return self.bom.name
    class Meta:
        verbose_name = u"BOM列表"
        verbose_name_plural = u"BOM列表"
