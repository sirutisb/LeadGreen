from rest_framework import serializers
from .models import Post, QRCode

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'author', 'qr_code', 'caption', 'created_at', 'private', 'reviewed', 'points_received']
        read_only_fields = ['author', 'reviewed', 'points_received']