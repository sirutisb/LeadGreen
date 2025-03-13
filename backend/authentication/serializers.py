from rest_framework import serializers
from users.models import UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    # Creates a password field that is write only
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ["username", "email", "password"]
    
    # Check if user name exist
    def validate_username(self, value):
        if UserProfile.objects.filter(username = value).exists():
            raise serializers.ValidationErrors("This username is already taken")
        return value

    def validate_email(self, value):
        if UserProfile.objects.filter(email = value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self, validated_data):
        # Adds a user object with the validated inputs
        user = UserProfile.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user