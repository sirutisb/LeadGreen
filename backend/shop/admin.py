from django.contrib import admin

# Register your models here.

from .models import Item, Inventory, Transaction

admin.site.register(Item)
admin.site.register(Inventory)
admin.site.register(Transaction)


