from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class UserProfile(AbstractUser):
    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        default='profile_pics/default.png',
        blank=True,
        null=True
        )

    # Dont use anymore, instead use GameProfile model
    # points_balance = models.IntegerField(default=0)
    # lifetime_points = models.IntegerField(default=0)
    # tree_level = models.IntegerField(default=1) # Current tree level
    # tree_growth = models.FloatField(default=0.0) # Progress towards next level
    # has_snail = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username}"