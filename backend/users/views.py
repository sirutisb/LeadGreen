from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import UserProfile

#from .serializers import BasicUserProfileSerializer
from .serializers import UserWithGameSerializer
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