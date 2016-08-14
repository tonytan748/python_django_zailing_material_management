from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$',views.login,name='login'),
    url(r'^login/$',views.login,name='login'),
    url(r'^logout/$',views.logout,name='logout'),
    url(r'^index/$',views.index,name='index'),
    url(r'^item_search/$',views.item_search,name='item_search'),
    url(r'^get_item/$',views.get_item,name='get_item'),
    url(r'^create_new_item/$',views.create_new_item,name='create_new_item'),
    url(r'^bomlist/$',views.bomlist,name='bomlist'),
    url(r'^bom_item_search/$',views.bom_item_search,name='bom_item_search'),

    url(r'^create_new_bom/$',views.create_new_bom,name='create_new_bom'),
    url(r'^get_old_bom/$',views.get_old_bom,name='get_old_bom'),
    url(r'^bom_name_search/$',views.bom_name_search,name='bom_name_search'),
    url(r'^create_new_type/$',views.create_new_type,name='create_new_type'),

    url(r'^itemtype/$',views.itemtype,name='itemtype'),
    url(r'^delete_type/$',views.delete_type,name='delete_type'),
    url(r'^edit_item_type/$',views.edit_item_type,name='edit_item_type'),

    # url(r'^bom_export/$',views.bom_export,name='bom_export'),

    url(r'^ajax_item_add/$', views.ajax_item_add, name='ajax_item_add'),
    url(r'^ajax_item_out/$', views.ajax_item_out, name='ajax_item_out'),
]
