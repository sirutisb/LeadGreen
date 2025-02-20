from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class UserProfile(AbstractUser):
    #profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    points_balance = models.IntegerField(default=0)
    lifetime_points = models.IntegerField(default=0)
    tree_level = models.IntegerField(default=1) # Current tree level
    tree_growth = models.FloatField(default=0.0) # Progress towards next level
    has_snail = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} - Points: {self.points_balance} | Level: {self.tree_level}"