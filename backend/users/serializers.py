from rest_framework import serializers
from .models import UserProfile

# For use in posts and profile pages etc
class BasicUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'profile_picture']
        read_only_fields = ['id']

class UserPageSerializer(serializers.ModelSerializer):
    # Game-related fields from GameProfi
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'profile_picture', 'date_joined', 'points_balance']


class UserWithPostSerializer(serializers.ModelSerializer):
    # Post-related fields from Post
    post_count = serializers.IntegerField(source='posts.count')
    latest_post = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'profile_picture', 'post_count', 'latest_post', 'points_balance', 'tree_level']

    def get_latest_post(self, obj):
        post = obj.posts.order_by('-created_at').first()
        if post:
            return {
                'profile_picture': post.user.profile_picture.url if post.user.profile_picture else None,
                'caption': post.caption,
                'created_at': post.created_at,
                'points' : post.points_received
            }
        return None