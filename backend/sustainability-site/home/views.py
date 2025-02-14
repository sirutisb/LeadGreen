from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, views, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer

# Create your views here.

# Basic views
def index(request):
    return HttpResponse("<h1>Welcome to LeadGreen</h1>")

def posts(request):
    return HttpResponse("Welcome to the posts, this is a collection of the public posts.")

# Post related views
class PostList(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostDetail(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostCreate(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        qr_code = serializer.validated_data['qr_code']
        points = qr_code.category.reward_points
        
        # Create the post
        post = serializer.save(
            author=self.request.user,
            points_received=points
        )
        
        # Update user's points
        profile = self.request.user.userprofile
        profile.points_balance += points
        profile.lifetime_points += points
        profile.save()

class PostReview(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            # Add your review logic here
            return Response({"message": "Review submitted"})
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

# User related views
class UserProfileDetail(views.APIView):
    def get(self, request):
        return Response({"message": "User profile details"})

class Leaderboard(views.APIView):
    def get(self, request):
        return Response({"message": "Leaderboard standings"})

# Tree related views
class WaterTree(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        profile = request.user.userprofile
        
        action = request.data.get('action')
        if action not in ['water', 'fertilize', 'clean']:
            return Response(
                {"error": "Invalid action. Must be 'water', 'fertilize', or 'clean'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Each action increases tree growth by different amounts
        growth_increase = {
            'water': 0.1,
            'fertilize': 0.15,
            'clean': 0.05
        }
        
        # Update tree growth
        profile.tree_growth += growth_increase[action]
        
        # Check if tree can level up (growth >= 1.0)
        if profile.tree_growth >= 1.0:
            profile.tree_level += 1
            profile.tree_growth = profile.tree_growth - 1.0
        
        profile.save()
        
        return Response({
            "message": f"Tree {action}ed successfully",
            "tree_level": profile.tree_level,
            "tree_growth": profile.tree_growth
        })

# Shop related views
class ShopItemList(generics.ListAPIView):
    def get(self, request):
        return Response({"message": "List of shop items"})

class PurchaseItem(views.APIView):
    def post(self, request, pk):
        return Response({"message": f"Purchase item {pk}"})

# QR Code validation
class ValidateQRCode(views.APIView):
    def post(self, request, code):
        return Response({"message": f"Validating QR code: {code}"}) 