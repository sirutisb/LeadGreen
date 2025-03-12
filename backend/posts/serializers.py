from rest_framework import serializers
from .models import Post
from qrcodes.models import QRCode

from users.serializers import BasicUserProfileSerializer

class PostSerializer(serializers.ModelSerializer):
    user = BasicUserProfileSerializer(read_only=True)
    qr_code = serializers.CharField(write_only=True)

    qr_code = serializers.SlugRelatedField(
        slug_field='code',           # The QRCode field to match against
        queryset=QRCode.objects.all(),  # The set of QRCode objects to search
        write_only=True              # Only used for input, not output
    )

    #qr_code = serializers.CharField()
    caption = serializers.CharField(required=True)
    image = serializers.ImageField(required=True)

    class Meta:
        model = Post
        fields = ['id', 'user',
                  'image', 'caption', 'created_at', 'private',
                  'qr_code', 'approved', 'points_received']
        read_only_fields = ['approved', 'points_received']

    # def validate_qr_code(self, value):
    #     if not QRCode.objects.filter(code=value).exists():
    #         raise serializers.ValidationError("Invalid QR code. Please input a valid QR code.")
    #     return value
    
    def create(self, validated_data):
        """Create the post after validation."""
        post = Post.objects.create(**validated_data)
        return post

class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'likes']
        read_only_fields = ['id', 'likes']