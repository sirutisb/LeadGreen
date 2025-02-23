from rest_framework import serializers
from .models import UserProfile


# For use in posts and profile pages etc
class BasicUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'profile_picture']


# This is for the Game Logic to handle instead
# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserProfile
#         fields = ['id', 'username', 'points_balance', 'lifetime_points', 'tree_level', 'tree_growth', 'has_snail']