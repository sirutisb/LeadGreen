from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import UserProfile
from random import choice


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
    """
    Model for plant, includes name, level, image 
    Allows for ordering through level
    """
    name = models.CharField(max_length=32)  # exampe - "Leafy", "Sprouto"
    level = models.IntegerField(unique=True)  # each level - one plant
    image = models.ImageField(
        upload_to="plants/",
        blank=True,
        null=True
    )

    class Meta:
        ordering = ['level']  # Order plants by level

    def __str__(self):
        return f"{self.name} (Level {self.level})"

class Insect(models.Model):
    """
    Model for insect, include name of bug, level to appear, spawn chance, image
    """
    name = models.CharField(max_length=32)  # example "Buzzly", "Creepsy"
    level = models.IntegerField(default=1)  # level requirement to appear
    spawn_chance = models.FloatField(default=0.2)  # prob of spawning
    image = models.ImageField(
        upload_to="insects/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.name


class GameProfile(models.Model):
    """
    Game profile model
    Seperate from standard user model - contains other functionality and variable
    Uses one to one relationship to assign each game profile to a user profile
    Includes:
      link to user
      current points, overall lifetime points
      plant level, growth, current plant
      current insect and last insect spawn
      spins remaining for roulette wheel
    """
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='game_profile')
    points_balance = models.IntegerField(default=0)
    lifetime_points = models.IntegerField(default=0)
    
    # Plant progress
    plant_level = models.IntegerField(default=1)  # start at level 1
    plant_growth = models.FloatField(default=0.0)  # go towards next level
    #current_plant = models.ForeignKey(Plant, on_delete=models.PROTECT)  # Changed to PROTECT and removed null=True
    current_plant = models.ForeignKey(Plant, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Insect mechanics
    current_insect = models.ForeignKey(Insect, on_delete=models.SET_NULL, null=True, blank=True)
    last_insect_spawn = models.DateTimeField(null=True, blank=True) # insect spawn cooldown
    
    # Game mechanics
    spins_remaining = models.IntegerField(default=5)

    def save(self, *args, **kwargs):
        """
        Save to database - make sure plant exists 
        """
        if not self.current_plant_id or self.current_plant.level != self.plant_level:
            self.current_plant = Plant.objects.get(level=self.plant_level)
        super().save(*args, **kwargs)

    def spawn_insect(self):
        """
        Randomly spawn an insect appropriate for the current level
        """
        #get all insects up to current level
        available_insects = Insect.objects.filter(level__lte=self.plant_level)
        if available_insects.exists():
            self.current_insect = choice(available_insects)
            self.save()

    def __str__(self):
        return f"{self.user.username}'s Game Profile | Level {self.plant_level}"

@receiver(post_save, sender=UserProfile)
def create_game_profile(sender, instance, created, **kwargs):
    """
    Creates game profile
    Create when user first exists
    """
    if created:  # only when the user is first created
        GameProfile.objects.create(
            user=instance,
            points_balance=100,  # Default starting points
            plant_level=1,       # Starting level
            plant_growth=0.0     # Starting growth
        )

# Connect the signal
post_save.connect(create_game_profile, sender=UserProfile)
