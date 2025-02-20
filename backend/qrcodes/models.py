from django.db import models

# Create your models here.

class Category(models.Model):
    type = models.CharField(max_length=32)
    reward_points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.type} - Reward: {self.reward_points}"

class QRCode(models.Model):
    code = models.CharField(max_length=32, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    location_name = models.CharField(max_length=32, default="")
    coordinates = models.CharField(max_length=32, default="")

    def __str__(self):
        return f"{self.location_name} - {self.category.type}"
