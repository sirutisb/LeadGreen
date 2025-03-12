from django.db import models
from users.models import UserProfile

#Shop Items and transactions
class Item(models.Model):
    ITEM_TYPE = [
        ('GROWTH', 'Growth'),
        ('WATER', 'Water'), # remove these later to generalise (use growth instead)
        ('SOIL', 'Soil'), # this also
        ('GLOVE', 'Glove'),
        ('FERTILIZER', 'Fertilizer'),
        ('SPECIAL', 'Special'),
    ]
    
    name = models.CharField(max_length=32)
    description = models.TextField(default="")
    price = models.IntegerField(default=0)
    stock = models.PositiveIntegerField(default=0) # Available in shop
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE)
    
    # Item effects
    growth_amount = models.FloatField(default=0.0)
    insect_spawn_chance = models.FloatField(default=0.0)
    special_effects = models.JSONField(null=True, blank=True)  # For future special items
    
    # Cooldown between uses
    cooldown_seconds = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} | Price: {self.price}"


class Inventory(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)

    class Meta:
        unique_together = ['user', 'item']

    def __str__(self):
        return f"{self.user.username} -> x{self.quantity} {self.item.name}"
    
class Transaction(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    total_price = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} bought {self.quantity} {self.item.name}"
    