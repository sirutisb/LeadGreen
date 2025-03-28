from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from authentication.serializers import RegisterSerializer
from users.serializers import BasicUserProfileSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterView(APIView):
    """
    Creates post request for registering
    Returns access token if registrations is valid
    Saves new user to DB
    """
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                "user": BasicUserProfileSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    """
    Creates post request for logging in
    Returns tokens along with user information if valid
    """
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid()
            tokens = serializer.validated_data
            user = serializer.user
            return Response({
                "tokens": tokens,
                "user": BasicUserProfileSerializer(user).data
            }, status=status.HTTP_200_OK)
            
        except Exception:
            return Response({
                "errors": {
                    "detail": "Invalid credentials"
                }
            }, status=status.HTTP_401_UNAUTHORIZED)