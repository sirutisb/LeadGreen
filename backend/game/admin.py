from django.contrib import admin
from .models import GameProfile, Plant, Insect, Prize

# Register your models here.

admin.site.register(GameProfile)

admin.site.register(Plant)
admin.site.register(Insect)

@admin.register(Prize)
class PrizeAdmin(admin.ModelAdmin):
    list_display = ["option", "value", "weight"]




from .models import Item, Inventory, Transaction, ItemEffect

admin.site.register(Item)
admin.site.register(Inventory)
admin.site.register(Transaction)
admin.site.register(ItemEffect)