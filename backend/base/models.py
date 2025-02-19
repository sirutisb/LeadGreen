from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class UserProfile(AbstractUser):
    #username = models.CharField(max_length=32, unique=True, primary_key=True)
    #bio = models.TextField(blank=True, null=True)
    #profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    points_balance = models.IntegerField(default=0)
    lifetime_points = models.IntegerField(default=0)
    tree_level = models.IntegerField(default=1) # Current tree level
    tree_growth = models.FloatField(default=0.0) # Progress towards next level
    has_snail = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} - Points: {self.points_balance} | Level: {self.tree_level}"

class Category(models.Model):
    type = models.CharField(max_length=32)
    reward_points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.type} - Reward: {self.reward_points}"

class QRCode(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    code = models.CharField(max_length=32, default="")
    location_name = models.CharField(max_length=32, default="")
    coordinates = models.CharField(max_length=32, default="")

    def __str__(self):
        return f"{self.location_name} - {self.category.type}"


class Post(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='posts/', blank=True)
    caption = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    private = models.BooleanField(default=False)
    qr_code = models.ForeignKey(
        QRCode,
        on_delete=models.SET_NULL,
        null=True
    )
    approved = models.BooleanField(default=False)
    points_received = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.author} - {self.caption} | Points: {self.points_received}"

    class Meta:
        ordering = ['created_at']


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