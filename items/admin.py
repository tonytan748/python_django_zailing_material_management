from django.contrib import admin

from .models import *

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


admin.site.register(ItemType,ItemTypeAdmin)
admin.site.register(Item,ItemAdmin)
admin.site.register(InOut,InOutAdmin)
admin.site.register(Bom,BomAdmin)
