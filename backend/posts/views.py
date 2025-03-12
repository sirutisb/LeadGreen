from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404

from .models import Post,Like
from .serializers import PostSerializer, PostLikeSerializer
from .pagination import PostPagination

from rest_framework import generics
from django.db import models

class PostListCreate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PostSerializer
    pagination_class = PostPagination

    def get_queryset(self):
        queryset = Post.objects.all().filter(approved=True)
        return queryset
    
    def perform_create(self, serializer):
        # Automatically set the user to the authenticated user
        serializer.save(user=self.request.user)

class ToggleLikePost(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]    
    def post(self, request, post_id):
        post = get_object_or_404(Post, id = post_id)
        like, created = Like.objects.get_or_create(user = request.user, post = post)
        if not created:
            like.delete()
            return Response({"message": "Unliked post"}, status=status.HTTP_200_OK)

        return Response({"message": "Liked post"}, status=status.HTTP_201_CREATED)