from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Player(User):
    balance = models.IntegerField(default=0)
    lifetimePoints = 

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    caption = models.CharField(max_Length=200, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    private = models.BooleanField(default=False)
    reviewed = models.BooleanField(default=False)
    pointsReceived = models.IntegerField(default=0)

    def __str__(self):
        return self.caption

    class Meta:
        ordering = ['created']