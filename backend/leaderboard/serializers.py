from django.utils import timezone
from rest_framework import serializers
from game.models import GameProfile

class GameProfileLeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)  # Get the username from the related UserProfile model

    class Meta:
        model = GameProfile
        fields = [
            'username', 'points_balance', 'lifetime_points', 'tree_level', 
        ]
        read_only_fields = ['username', 'points_balance', 'lifetime_points', 'tree_level',]
