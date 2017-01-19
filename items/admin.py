from django.contrib import admin

from .models import *


class CityAdmin(admin.ModelAdmin):
    list_display = ('name')

class OfficeAdmin(admin.ModelAdmin):
    list_display = ('city', 'name')

class UserCityAdmin(admin.ModelAdmin):
    list_display = ('user', 'city')

class UserActionAdmin(admin.ModelAdmin):
    list_display = ('user', 'action_perm')

class ItemTypeAdmin(admin.ModelAdmin):
    list_display = ('name','description')

class ItemAdmin(admin.ModelAdmin):
    list_display = ('ids','modelname','potting','position','description','markup','qty')


class InOutAdmin(admin.ModelAdmin):
    list_display = ('item','qty','status','user','created')

class BomlistInline(admin.TabularInline):
    model = BomList


class BomAdmin(admin.ModelAdmin):
    list_display = ('name',)
    inlines = [BomlistInline]

admin.site.register(City,CityAdmin)
admin.site.register(Office,OfficeAdmin)
admin.site.register(UserCity,UserCityAdmin)
admin.site.register(UserAction,UserActionAdmin)

admin.site.register(ItemType,ItemTypeAdmin)
admin.site.register(Item,ItemAdmin)
admin.site.register(InOut,InOutAdmin)
admin.site.register(Bom,BomAdmin)
