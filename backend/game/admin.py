from django.contrib import admin
# from .models import
from .models import ShopItem, UserItem, UserGameProfile

# Register your models here.

admin.site.register(ShopItem)
admin.site.register(UserItem)
admin.site.register(UserGameProfile)