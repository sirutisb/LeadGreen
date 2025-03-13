from django.db import models
from users.models import UserProfile

#Shop Items and transactions
class ItemEffect(models.Model):
    """
    Generic effects that items can have when used
    """
    EFFECT_TYPES = [
        ('GROW', 'Grow Tree'),
        ('REMOVE_INSECT', 'Remove Insect'),
        ('ADD_POINTS', 'Add Points'),
        ('SPAWN_INSECT', 'Spawn Insect'),
        ('SPECIAL', 'Special Effect'),
        # Add more effect types as needed
    ]

    name = models.CharField(max_length=64)
    effect_type = models.CharField(max_length=32, choices=EFFECT_TYPES)
    # Store effect parameters as JSON for flexibility
    parameters = models.JSONField(default=dict, help_text="Effect-specific parameters (e.g. growth_amount, points, chances)")
    
    def __str__(self):
        return f"{self.name} ({self.effect_type})"

class Item(models.Model):
    ITEM_TYPE = [
        ('TOOL', 'Tool'),
        ('CONSUMABLE', 'Consumable'),
        ('SPECIAL', 'Special'),
    ]
    
    name = models.CharField(max_length=32)
    description = models.TextField(default="")
    price = models.IntegerField(default=0)
    stock = models.PositiveIntegerField(default=0)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE)
    effects = models.ManyToManyField(ItemEffect, related_name='items')
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
    