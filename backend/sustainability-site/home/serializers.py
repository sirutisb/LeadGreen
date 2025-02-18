from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at', 'author']
    
    def create(self, validated_data):
        post = Post.objects.create_post(**validated_data)
        return post