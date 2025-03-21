from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class UserProfile(AbstractUser):
    profile_picture = models.CharField(
        max_length=100,
        default="profile_pics/default.png",
        help_text="Path to the profile picture in static files" 
    )

    def __str__(self):
        return f"{self.username}"