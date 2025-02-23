from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import UserProfile


# Shop Items and transactions
# class ShopItem(models.Model):
#     name = models.CharField(max_length=32)
#     effect = models.CharField(max_length=32, default="")
#     description = models.TextField(default="")
#     cost = models.IntegerField(default=0)

#     def __str__(self):
#         return f"{self.name} - {self.cost} points"


# class UserItem(models.Model):
#     user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
#     item = models.ForeignKey(ShopItem, on_delete=models.CASCADE)
#     quantity = models.IntegerField(default=0)

#     def __str__(self):
#         return f"{self.user.username} - x{self.quantity} {self.item.name}"
    

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
    #current_plant = models.ForeignKey(Plant, on_delete=models.PROTECT)  # Changed to PROTECT and removed null=True
    current_plant = models.ForeignKey(Plant, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Insect mechanics
    current_insect = models.ForeignKey(Insect, on_delete=models.SET_NULL, null=True, blank=True)
    last_insect_spawn = models.DateTimeField(null=True, blank=True) # For insect spawn cooldown
    
    # Game mechanics
    spins_remaining = models.IntegerField(default=5)

    def save(self, *args, **kwargs):
        # Ensure we have a plant before saving
        if not self.current_plant_id or self.current_plant.level != self.plant_level:
            self.current_plant = Plant.objects.get(level=self.plant_level)
        super().save(*args, **kwargs)

    def spawn_insect(self):
        """Randomly spawn an insect appropriate for the current level"""
        from random import choice
        # Get all insects up to current level
        available_insects = Insect.objects.filter(level__lte=self.plant_level)
        if available_insects.exists():
            self.current_insect = choice(available_insects)
            self.save()

    def __str__(self):
        return f"{self.user.username}'s Game Profile | Level {self.plant_level}"

@receiver(post_save, sender=UserProfile)
def create_game_profile(sender, instance, created, **kwargs):
    if created:  # only when the user is first created
        GameProfile.objects.create(
            user=instance,
            points_balance=100,  # Default starting points
            plant_level=1,       # Starting level
            plant_growth=0.0     # Starting growth
        )

# Connect the signal
post_save.connect(create_game_profile, sender=UserProfile)