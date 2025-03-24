from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os

# Create your models here.

class UserProfile(AbstractUser):
    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        default='profile_pics/default.png',
    )

    def save(self, *args, **kwargs):
        # If this is a new user and no profile picture is set
        if not self.pk and not self.profile_picture:
            # Set the default profile picture
            self.profile_picture = 'profile_pics/default.png'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username}"