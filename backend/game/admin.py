from django.contrib import admin
from .models import ShopItem, UserItem, GameProfile, Plant, Insect

# Register your models here.

admin.site.register(ShopItem)
admin.site.register(UserItem)

admin.site.register(GameProfile)

admin.site.register(Plant)
admin.site.register(Insect)
