from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404

from .models import Post,PostLike
from .serializers import PostSerializer, PostLikeSerializer
from .pagination import PostPagination

from rest_framework import generics
from django.db import models
from django.db import transaction
from django.db.models import F, Q

class PostListCreate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PostSerializer
    pagination_class = PostPagination

    def get_queryset(self):
        queryset = Post.objects.filter(approved=True)
        return queryset
    
    def perform_create(self, serializer):
        # Automatically set the user to the authenticated user
        serializer.save(user=self.request.user)

class ToggleLikePost(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    @transaction.atomic
    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        like, created = PostLike.objects.get_or_create(
            user=request.user, 
            post=post
        )
        if created:
            Post.objects.filter(id=post.id).update(likes_count=F('likes_count') + 1)
            return Response({"message": "Liked post"}, status=201)
        return Response({"message": "Already liked"}, status=200)

    @transaction.atomic
    def delete(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        result = PostLike.objects.filter(user=request.user, post=post).delete()
        if result[0] > 0:
            Post.objects.filter(id=post.id).update(likes_count=F('likes_count') - 1)
            return Response({"message": "Unliked post"}, status=200)
        return Response({"message": "You haven't liked this post"}, status=400)