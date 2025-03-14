from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from game.serializers import PlantProgressSerializer, InsectSerializer
from .serializers import  BasicUserProfileSerializer, UserWithGameSerializer, UserWithPostSerializer
from game.models import GameProfile


#from .serializers import BasicUserProfileSerializer

from posts.serializers import PostSerializer
from rest_framework.pagination import PageNumberPagination
from posts.pagination import PostPagination
from posts.models import Post
from rest_framework import generics

class UserProfileView(APIView):
    def get(self, request, pk):
        try:
            user = UserProfile.objects.get(id=pk)
            serializer = UserWithGameSerializer(user, many=False)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class UserPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = PostPagination

    def get_queryset(self):
        user_id = self.kwargs['id']
        return Post.objects.filter(user_id=user_id).order_by('-created_at') # Should it only show their approved posts?
    
class UserPageDetails(APIView):
    def get(self, request, pk):
        try:
            user = UserProfile.objects.get(id=pk)
            queryset = GameProfile.objects.all().order_by('-lifetime_points')
            
            rank = None
            for i, profile in enumerate(queryset, 1):
                if profile.user == user:
                    rank = i
                    break
           

            return Response({
                'user' : UserPageDetails(user).data,
                'tree' : PlantProgressSerializer(user.game_profile).data,
                'posts' : PostSerializer(user.posts.all().order_by('-created_at'), many=True,).data,
                'rank' : rank
            })
        except UserProfile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)




        

            