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
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from PIL import Image
from io import BytesIO


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
                'user': UserPageSerializer(user, context={'request': request}).data,
                'tree': PlantProgressSerializer(user.game_profile).data,
                'posts': PostSerializer(
                    user.post_set.order_by('-created_at'),
                    many=True,
                    context={'request': request}
                ).data,
                'rank': user.game_profile.get_rank()
            })
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

class UpdateProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            if 'profile_picture' not in request.FILES:
                return Response({
                    'error': 'No profile picture provided'
                }, status=status.HTTP_400_BAD_REQUEST)

            image = request.FILES['profile_picture']
            
            # Validate file type
            if not image.content_type.startswith('image/'):
                return Response({
                    'error': 'File must be an image'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Validate file size (max 5MB)
            if image.size > 5 * 1024 * 1024:
                return Response({
                    'error': 'Image size must be less than 5MB'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Process and save the image
            img = Image.open(image)
            
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize image if too large (max 500x500)
            if img.width > 500 or img.height > 500:
                img.thumbnail((500, 500), Image.Resampling.LANCZOS)
            
            # Save the processed image
            output = BytesIO()
            img.save(output, format='JPEG', quality=85)
            output.seek(0)

            # Delete old profile picture if it exists
            if request.user.profile_picture and request.user.profile_picture.name != 'profile_pics/default.png':
                default_storage.delete(request.user.profile_picture.name)

            # Save new profile picture
            filename = f'profile_pics/{request.user.id}_{os.path.splitext(image.name)[1]}'
            path = default_storage.save(filename, ContentFile(output.getvalue()))
            
            # Update user's profile picture
            request.user.profile_picture = path
            request.user.save()

            return Response({
                'message': 'Profile picture updated successfully',
                'profile_picture': request.user.profile_picture.url
            })

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)