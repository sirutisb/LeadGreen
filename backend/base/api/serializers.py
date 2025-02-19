from rest_framework import serializers
from django.contrib.auth.models import User
from base.models import UserProfile

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserProfile
#         fields = '__all__'
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         user = UserProfile.objects.create_user(**validated_data)
#         return user

class UserProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserProfile
        fields = '__all__'

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


