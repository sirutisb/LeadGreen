from django.contrib import admin
from .models import GameProfile, Plant, Insect, Prize, ItemEffect, Item, Inventory, Transaction

# Register your models here.

admin.site.register(GameProfile)

admin.site.register(Plant)
admin.site.register(Insect)

@admin.register(Prize)
class PrizeAdmin(admin.ModelAdmin):
    list_display = ["option", "value", "weight"]

@admin.register(ItemEffect)
class ItemEffectAdmin(admin.ModelAdmin):
    list_display = ('name', 'effect_type')
    list_filter = ('effect_type',)
    search_fields = ('name',)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'item_type', 'cooldown_seconds')
    list_filter = ('item_type',)
    search_fields = ('name', 'description')
    filter_horizontal = ('effects',)

admin.site.register(Inventory)
admin.site.register(Transaction)
