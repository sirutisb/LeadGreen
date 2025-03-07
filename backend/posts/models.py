from django.db import models
from users.models import UserProfile
from qrcodes.models import QRCode

# Create your models here.

class Post(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    qr_code = models.ForeignKey(QRCode, on_delete=models.PROTECT)
    #qr_code = models.ForeignKey(QRCode, on_delete=models.PROTECT, to_field='code')
    #qr_code = models.CharField(max_length=32) # why was this a normal field in the first place
    image = models.ImageField(upload_to='posts/', blank=False, null=False)
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    private = models.BooleanField(default=False)
    approved = models.BooleanField(null=True, default=None)
    points_received = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.caption} | Points: {self.points_received}"

    class Meta:
        ordering = ['-created_at']


def save(self, *args, **kwargs):
    # Check if the QR code exists
    if not self.qr_code:
        raise ValueError("QR Code cannot be empty")
        
    if QRCode.objects.filter(code=self.qr_code).exists():
        print(f"Post {self.caption} saved successfully, it exists.")
        super().save(*args, **kwargs)
        return
    print("doesnt exist")
    raise ValueError("QR Code must match an existing QRCode object")