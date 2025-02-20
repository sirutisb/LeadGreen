from rest_framework import serializers
from base.models import Post, QRCode

from users.serializers import UserProfileSerializer
from qrcodes.serializers import QRCodeSerializer

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


