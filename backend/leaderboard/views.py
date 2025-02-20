from django.shortcuts import render
from rest_framework import generics
from users.models import UserProfile
from .serializers import UserProfileSerializer

class list_pointsBalance(generics.ListAPIView):
    queryset = UserProfile.objects.all().order_by('-points_balance')
    serializer_class = UserProfileSerializer

class list_lifetimePoints(generics.ListAPIView):
    queryset = UserProfile.objects.all().order_by('-lifetime_points')
    serializer_class = UserProfileSerializer

class list_treeLevel(generics.ListAPIView):
    queryset = UserProfile.objects.all().order_by('-tree_level')
    serializer_class = UserProfileSerializer

