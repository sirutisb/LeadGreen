from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from base.models import UserProfile, Post
from .serializers import RegisterSerializer, UserProfileSerializer, PostSerializer

from .serializers import RegisterSerializer, UserProfileSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "User registered successfully!",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getUserProfile(request, pk):
    try:
        user = UserProfile.objects.get(id=pk)
        serializer = UserProfileSerializer(user, many=False)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/token',
        'api/token/refresh'
    ]
    return Response(routes)


class PostView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    # Only require authentication for creating posts
    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required to create posts."},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        serializer = PostSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request, *args, **kwargs):
        posts = Post.objects.filter(approved=True).select_related('user', 'qr_code')
        
        # Filter by user if specified
        user_id = request.query_params.get('user_id')
        if user_id:
            posts = posts.filter(user_id=user_id)
            
        # Include private posts only if user is authenticated and they belong to the requesting user
        if request.user.is_authenticated:
            if not request.user.is_staff:
                posts = posts.filter(private=False) | posts.filter(user=request.user)
        else:
            # For unauthenticated users, only show public posts
            posts = posts.filter(private=False)
            
        serializer = PostSerializer(
            posts, 
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

