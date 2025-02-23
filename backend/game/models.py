from django.db import models
from users.models import UserProfile


# Shop Items and transactions
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
    

class Plant(models.Model):
    name = models.CharField(max_length=32)  # e.g., "Leafy", "Sprouto"
    level = models.IntegerField(unique=True)  # Each level has exactly one plant

    class Meta:
        ordering = ['level']  # Order plants by level

    def __str__(self):
        return f"{self.name} (Level {self.level})"

class Insect(models.Model):
    name = models.CharField(max_length=32)  # e.g., "Buzzly", "Creepsy"
    level = models.IntegerField(default=1)  # Level requirement to appear
    spawn_chance = models.FloatField(default=0.2)  # Probability of spawning

    def __str__(self):
        return self.name


class GameProfile(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='game_profile')
    points_balance = models.IntegerField(default=0)
    
    # Plant progress
    plant_level = models.IntegerField(default=1)  # Start at level 1
    plant_growth = models.FloatField(default=0.0)  # Progress towards next level (0.0 to 1.0)
    current_plant = models.ForeignKey(Plant, on_delete=models.SET_NULL, null=True)
    
    # Insect mechanics
    current_insect = models.ForeignKey(Insect, on_delete=models.SET_NULL, null=True, blank=True)
    last_insect_spawn = models.DateTimeField(null=True, blank=True) # For insect spawn cooldown
    
    # Game mechanics
    spins_remaining = models.IntegerField(default=5)

    def add_growth(self, amount):
        self.plant_growth += amount
        while self.plant_growth >= 1.0:
            self.plant_growth -= 1.0
            self.plant_level += 1

        try:
            self.current_plant = Plant.objects.get(level=self.plant_level)
        except Plant.DoesNotExist:
            pass # If no plant exists for this level, keep the last plant

    def __str__(self):
        return f"{self.user.username}'s Game Profile | Level {self.plant_level}"