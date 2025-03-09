from django.utils import timezone
from rest_framework import serializers
from game.models import GameProfile

class GameProfileLeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)  # Get the username from the related UserProfile model
    user_image = serializers.ImageField(source='user.profile_picture', read_only=True)

    class Meta:
        model = GameProfile
        fields = [
            'user_image' ,'username', 'points_balance', 'lifetime_points', 'tree_level',
        ]
        read_only_fields = ['user_image', 'username', 'points_balance', 'lifetime_points', 'tree_level',]
