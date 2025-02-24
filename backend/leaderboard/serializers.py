from django.utils import timezone
from rest_framework import serializers
from game.models import GameProfile
from users.models import UserProfile  # Assuming UserProfile is in the users app

class GameProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)  # Get the username from the related UserProfile model

    class Meta:
        model = GameProfile
        fields = [
            'username', 'points_balance', 'lifetime_points', 'plant_level', 
        ]
        read_only_fields = ['username', 'points_balance', 'lifetime_points', 'plant_level',]
