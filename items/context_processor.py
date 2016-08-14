

def page_data(request):
    return {
        'header':u"再灵物料管理系统",
        'navs':[{"name":u"报表导出","url":"#"}],
        # {"name":u"库存","url":"#"},
        'sidebars':[[{'name':u"物料管理","url":"../index/"},{"name":u"BOM清单","url":"../bomlist/"},{"name":u"类型管理","url":"../itemtype/"}]],
        # ,[{"name":"Nav item","url":"#"}]],
        'items_title':[u"编码",u"型号",u"封装",u"位号",u"描述",u"类型",u"价格",u"数量",u"备注"],
        }


# ids
# modelname
# potting
# position
# description
# price
# qty
# markup
