from rest_framework import serializers
from users.models import UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    # Creates a password field that is write only
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        # Adds a user object with the validated inputs
        user = UserProfile.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user