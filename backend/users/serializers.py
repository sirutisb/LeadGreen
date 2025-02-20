from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    #password = serializers.CharField(write_only=True) # for safety on all fields (maybe not needed)
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'points_balance', 'lifetime_points', 'tree_level', 'tree_growth', 'has_snail']
        #fields = '__all__'