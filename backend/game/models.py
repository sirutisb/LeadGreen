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
    

# TODO: add plants to database
class Plant(models.Model):
    name = models.CharField(max_length=32)

class GameProfile(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='game_profile')
    points_balance = models.IntegerField(default=0) # Progress towards next level
    tree_level = models.IntegerField(default=0)
    tree_growth = models.FloatField(default=0.0) # current tree level
    spins_remaining = models.IntegerField(default=5)
    #plant_name = models.CharField(max_length=32, default='leafy')
    #plant = models.ForeignKey(Plant, on_delete=models.CASCADE) # TO be added
    has_bug = models.BooleanField(default=False)