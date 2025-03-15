from rest_framework import serializers
from .models import Post, PostLike
from qrcodes.models import QRCode

from users.serializers import BasicUserProfileSerializer

class PostSerializer(serializers.ModelSerializer):
    user = BasicUserProfileSerializer(read_only=True)
    qr_code = serializers.SlugRelatedField(
        slug_field='code',
        queryset=QRCode.objects.all(),
        write_only=True
    )
    image = serializers.ImageField(required=True)
    caption = serializers.CharField(required=True)
    likes_count = serializers.IntegerField(read_only=True)
    liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user',
                  'image', 'caption', 'created_at', 'private',
                  'qr_code', 'approved', 'points_received',
                  'likes_count', 'liked_by_user']
        read_only_fields = ['approved', 'points_received', 'likes_count']

    def get_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.post_likes.filter(user=request.user).exists()
        return False

class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = ['id', 'likes']
        read_only_fields = ['id', 'likes']