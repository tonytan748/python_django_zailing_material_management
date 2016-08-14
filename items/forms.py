from django.forms import ModelForm,Textarea
from .models import Item


class ItemForm(ModelForm):
    class Meta:
        model = Item
        fields = ["ids","modelname","potting","position","itemtype","qty","price","description","markup"]
        widgets = {
            'markup':Textarea(attrs={"cols":20,"rows":5}),
        }
