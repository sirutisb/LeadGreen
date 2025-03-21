from rest_framework import serializers
from .models import UserProfile
from posts.models import Post

# For use in posts and profile pages etc
class BasicUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'profile_picture']
        read_only_fields = ['id']

class UserWithGameSerializer(serializers.ModelSerializer):
    # Game-related fields from GameProfile
    points_balance = serializers.IntegerField(source='game_profile.points_balance')
    tree_level = serializers.IntegerField(source='game_profile.tree_level')
    current_plant = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'profile_picture', 'points_balance', 'tree_level', 'current_plant']

class UserPageSerializer(serializers.ModelSerializer):
    points_balance = serializers.IntegerField(source='game_profile.points_balance')
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'profile_picture', 'points_balance']

class UserWithPostSerializer(serializers.ModelSerializer):
    # Post-related fields from Post

    class Meta:
        model = Post
        fields = ['caption', 'created_at', 'points_received']

    def get_latest_post(self, obj):
        post = obj.post_set.order_by('-created_at').first()
        if post:
            return {
                'caption': post.caption,
                'created_at': post.created_at,
                'points' : post.points_received
            }
        return None