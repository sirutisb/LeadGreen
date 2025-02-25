from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Post
from .serializers import PostSerializer
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





# class PostView(APIView):
#     permission_classes = [IsAuthenticatedOrReadOnly]
#     parser_classes = (MultiPartParser, FormParser)
    
#     # Only require authentication for creating posts
#     def post(self, request, *args, **kwargs):
#         if not request.user.is_authenticated:
#             return Response(
#                 {"detail": "Authentication required to create posts."},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )
            
#         serializer = PostSerializer(
#             data=request.data,
#             context={'request': request}
#         )
        
#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 serializer.data,
#                 status=status.HTTP_201_CREATED
#             )
#         return Response(
#             serializer.errors,
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     def get_queryset(self):
#         # Extract common queryset logic
#         queryset = Post.objects.filter(approved=True).select_related('user', 'qr_code')
#         if self.request.user.is_authenticated:
#             if not self.request.user.is_staff:
#                 return queryset.filter(private=False) | queryset.filter(user=self.request.user)
#         return queryset.filter(private=False)

#     def get(self, request, *args, **kwargs):
#         posts = self.get_queryset()
        
#         # Filter by user if specified
#         user_id = request.query_params.get('user_id')
#         if user_id:
#             posts = posts.filter(user_id=user_id)
            
#         serializer = PostSerializer(
#             posts, 
#             many=True,
#             context={'request': request}
#         )
#         return Response(serializer.data)