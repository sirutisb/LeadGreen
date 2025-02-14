from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, views, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer
import random

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
        
        # Define costs and growth increases for each action
        action_details = {
            'water': {'cost': 10, 'growth': 0.1},
            'fertilize': {'cost': 25, 'growth': 0.25},
            'clean': {'cost': 15, 'growth': 0}  # Clean doesn't increase growth
        }
        
        # Check if user has enough points
        if profile.points_balance < action_details[action]['cost']:
            return Response(
                {"error": f"Insufficient points. {action} costs {action_details[action]['cost']} points"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # If there's a snail, only allow cleaning
        if profile.has_snail and action != 'clean':
            return Response(
                {"error": "Tree has a snail! You must clean it first"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Process the action
        if action == 'clean':
            profile.has_snail = False
        else:
            # Add growth if not cleaning
            profile.tree_level += action_details[action]['growth']
            
            # Random chance (10%) to get a snail after growing
            if not profile.has_snail and random.random() < 0.1:
                profile.has_snail = True
        
        # Deduct points
        profile.points_balance -= action_details[action]['cost']
        
        profile.save()
        
        return Response({
            "message": f"Tree {action}ed successfully",
            "tree_level": profile.tree_level,
            "has_snail": profile.has_snail,
            "points_balance": profile.points_balance
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