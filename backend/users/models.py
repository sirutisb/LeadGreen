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
    
    points_balance = models.IntegerField(default=0)
    lifetime_points = models.IntegerField(default=0)

    ''' 
    uncomment if changing method of seperating base profile / game, etc...

    tree_level = models.IntegerField(default=1) # Current tree level
    tree_growth = models.FloatField(default=0.0) # Progress towards next level
    has_snail = models.BooleanField(default=False)
    '''

    def __str__(self):
        return f"{self.username} - Points: {self.points_balance} | Level: {self.tree_level}"
    

class UserGameProfile(models.Model):
    # relate to user profile
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    
    # user fields only relevant to game profile
    tree_level = models.IntegerField(default=1) # current tree level
    tree_growth = models.FloatField(default=0.0) # Progress towards next level
    has_snail = models.BooleanField(default=False)