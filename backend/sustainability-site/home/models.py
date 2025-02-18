from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    points_balance = models.IntegerField(default=0)
    lifetime_points = models.IntegerField(default=0)
    tree_level = models.IntegerField(default=0)
    tree_growth = models.FloatField(default=0) # float between (0,1)

    def __str__(self):
        return f"{self.user.username} - {self.points_balance} points"

class Category(models.Model):
    type = models.CharField(max_length=32)
    reward_points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.type} - {self.reward_points} points"

class QRCode(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    code = models.CharField(max_length=32, default="")
    location_name = models.CharField(max_length=32, default="")
    coordinates = models.CharField(max_length=32, default="")

    def __str__(self):
        return f"{self.location_name} - {self.category.type}"


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    qr_code = models.ForeignKey(QRCode, on_delete=models.CASCADE)
    caption = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    private = models.BooleanField(default=False)
    reviewed = models.BooleanField(default=False)
    points_received = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.author} - {self.caption}"

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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(ShopItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - x{self.quantity} {self.item.name}"


    #     class Post(models.Model):
    # user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    # qr_code_location = models.CharField(max_length=255)
    # image = models.ImageField(upload_to="uploads/")
    # description = models.TextField()
    # points = models.IntegerField(default=0)
    # approved = models.BooleanField(default=False)

    # def __str__(self):
    #     return f"{self.user.username} - {self.qr_code_location}"