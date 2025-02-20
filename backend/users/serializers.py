from rest_framework import serializers
from base.models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    #password = serializers.CharField(write_only=True) # for safety on all fields (maybe not needed)
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'points_balance', 'lifetime_points', 'tree_level', 'tree_growth', 'has_snail']
        #fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = UserProfile.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user