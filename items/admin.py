from django.contrib import admin

from .models import *


class CityAdmin(admin.ModelAdmin):
    list_display = ('name',)

class OfficeAdmin(admin.ModelAdmin):
    list_display = ('city', 'name')

class UserCityAdmin(admin.ModelAdmin):
    list_display = ('user', 'city')

class UserActionAdmin(admin.ModelAdmin):
    list_display = ('user', 'action_perm')

class ItemTypeAdmin(admin.ModelAdmin):
    list_display = ('name','description')

class ItemAdmin(admin.ModelAdmin):
    list_display = ('ids', 'name', 'modelname','city', 'office','itemtype','qty','price', 'on_user','use_date')


admin.site.register(City,CityAdmin)
admin.site.register(Office,OfficeAdmin)
admin.site.register(UserCity,UserCityAdmin)
admin.site.register(UserAction,UserActionAdmin)

admin.site.register(ItemType,ItemTypeAdmin)
admin.site.register(Item,ItemAdmin)
admin.site.register(UseDetail)
