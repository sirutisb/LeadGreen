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
        serializer.save(author=self.request.user)

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
    def post(self, request):
        return Response({"message": "Tree watered"})

class UpgradeTree(views.APIView):
    def post(self, request):
        return Response({"message": "Tree upgraded"})

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