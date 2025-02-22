from django.db import models
from users.models import UserProfile
from qrcodes.models import QRCode

# Create your models here.

class Post(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='posts/', blank=False, null=False)
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    private = models.BooleanField(default=False)
    qr_code = models.CharField(max_length=32)
    approved = models.BooleanField(null=True, default=None)
    points_received = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.caption} | Points: {self.points_received}"

    class Meta:
        ordering = ['-created_at']