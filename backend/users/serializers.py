from rest_framework import serializers
from .models import UserProfile


# For use in posts and profile pages etc
class BasicUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'profile_picture']