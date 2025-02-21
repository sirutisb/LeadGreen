from django.db import models
from users.models import UserProfile

# Create your models here.

class ShopItem(models.Model):
    name = models.CharField(max_length=32)
    effect = models.CharField(max_length=32, default="")
    description = models.TextField(default="")
    cost = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.cost} points"


class UserItem(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    item = models.ForeignKey(ShopItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - x{self.quantity} {self.item.name}"

class GameState(models.Model):
    tree_level = models.IntegerField(default=0)
    growth = models.FloatField(default=0.0)
    points = models.IntegerField(default=0)
    spins = models.IntegerField(default=0)
    plant = models.CharField(max_length=32, default='leafy')
    snail = models.BooleanField(default=False)