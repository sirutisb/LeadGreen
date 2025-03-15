from rest_framework import serializers
from .models import Post, Like
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
    likes_count = serializers.SerializerMethodField()
    liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user',
                  'image', 'caption', 'created_at', 'private',
                  'qr_code', 'approved', 'points_received', 'likes_count',
                  'liked_by_user']
        read_only_fields = ['approved', 'points_received']

    # def validate_qr_code(self, value):
    #     if not QRCode.objects.filter(code=value).exists():
    #         raise serializers.ValidationError("Invalid QR code. Please input a valid QR code.")
    #     return value
    
    def create(self, validated_data):
        """Create the post after validation."""
        post = Post.objects.create(**validated_data)
        return post

    def get_likes_count(self, obj):
        return obj.post_likes.count()

    def get_liked_by_user(self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.post_likes.filter(user = request.user).exists()
        return False

class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'likes']
        read_only_fields = ['id', 'likes']