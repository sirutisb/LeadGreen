from django.contrib import admin
from .models import GameProfile, Plant, Insect

# Register your models here.

admin.site.register(GameProfile)

admin.site.register(Plant)
admin.site.register(Insect)
