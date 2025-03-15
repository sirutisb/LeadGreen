from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from .models import UserProfile
from game.serializers import PlantProgressSerializer, InsectSerializer
from .serializers import  BasicUserProfileSerializer, UserWithGameSerializer, UserWithPostSerializer, UserPageSerializer
from game.models import GameProfile


#from .serializers import BasicUserProfileSerializer

from posts.serializers import PostSerializer
from rest_framework.pagination import PageNumberPagination
from posts.pagination import PostPagination
from posts.models import Post
from rest_framework import generics

# class UserProfileView(APIView):
#     def get(self, request, pk):
#         try:
#             user = UserProfile.objects.get(id=pk)
#             serializer = UserWithGameSerializer(user, many=False)
#             return Response(serializer.data)
#         except UserProfile.DoesNotExist:
#             return Response(status=status.HTTP_404_NOT_FOUND)

class UserPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = PostPagination

    def get_queryset(self):
        user_id = self.kwargs['id']
        return Post.objects.filter(user_id=user_id).order_by('-created_at') # Should it only show their approved posts?
    
class UserProfileView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:    
            user = UserProfile.objects.get(id=pk)
            return Response({
                'user': UserPageSerializer(user).data,
                'tree': PlantProgressSerializer(user.game_profile).data,
                'posts': PostSerializer(
                    user.post_set.order_by('-created_at'),
                    many=True
                ).data,
                'rank': user.game_profile.get_rank()
            })
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)