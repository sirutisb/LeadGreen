from django.contrib import admin
from .models import UserProfile, Category, QRCode, Post, ShopItem

admin.site.register(UserProfile)
admin.site.register(Category)
admin.site.register(QRCode)
admin.site.register(Post)
admin.site.register(ShopItem)
