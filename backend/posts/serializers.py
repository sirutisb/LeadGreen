from rest_framework import serializers
from .models import Post
from qrcodes.models import QRCode

from users.serializers import BasicUserProfileSerializer

class PostSerializer(serializers.ModelSerializer):
    user = BasicUserProfileSerializer(read_only=True)
    qr_code = serializers.CharField(write_only=True)
    #qr_code = serializers.CharField()
    caption = serializers.CharField(required=True)
    image = serializers.ImageField(required=True)

    class Meta:
        model = Post
        fields = ['id', 'user',
                  'image', 'caption', 'created_at', 'private',
                  'qr_code', 'approved', 'points_received']
        read_only_fields = ['approved', 'points_received']

    def validate_qr_code(self, value):
        if not QRCode.objects.filter(code=value).exists():
            raise serializers.ValidationError("Invalid QR code. Please scan a valid QR code.")
        return value
    
    def create(self, validated_data):
        """Create the post after validation."""
        return Post.objects.create(**validated_data)