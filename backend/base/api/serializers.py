from rest_framework import serializers
from django.contrib.auth.models import User
from base.models import UserProfile, Post, QRCode

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

class QRCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRCode
        fields = ['id', 'code', 'location_name', 'category']

class PostSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    qr_code = QRCodeSerializer(read_only=True)
    qr_code_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'caption', 'created_at', 
                 'private', 'qr_code', 'qr_code_id', 'approved', 
                 'points_received']
        read_only_fields = ['approved', 'points_received', 'user']

    def create(self, validated_data):
        # Remove qr_code_id from validated data if it exists
        qr_code_id = validated_data.pop('qr_code_id', None)
        
        # Get the current user from the context
        user = self.context['request'].user
        
        # Create the post instance
        post = Post.objects.create(
            user=user,
            **validated_data
        )
        
        # If QR code ID was provided, try to set it
        if qr_code_id:
            try:
                qr_code = QRCode.objects.get(id=qr_code_id)
                post.qr_code = qr_code
                post.save()
            except QRCode.DoesNotExist:
                pass
        
        return post


