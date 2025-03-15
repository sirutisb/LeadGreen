from django.db import models
from django.db.models import F
from users.models import UserProfile
from qrcodes.models import QRCode

# Create your models here.

class Post(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    qr_code = models.ForeignKey(QRCode, on_delete=models.PROTECT)
    image = models.ImageField(upload_to='posts/', blank=False, null=False)
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    private = models.BooleanField(default=False)
    approved = models.BooleanField(null=True, default=None)
    points_received = models.IntegerField(default=0)
    
    likes_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} | {self.caption} - Points: {self.points_received}"

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.qr_code_id:
            raise ValueError("QR Code cannot be empty")
        super().save(*args, **kwargs)

    def update_likes_count(self):
        self.likes_count = self.post_likes.count()
        self.save(update_fields=['likes_count'])

class PostLike(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
    
    def __str__(self):
        return f"{self.user.username} liked {self.post.caption}"