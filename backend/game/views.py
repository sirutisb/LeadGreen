from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

from django.shortcuts import get_object_or_404

from .models import ShopItem, UserItem
from .serializers import ShopItemSerializer, UserItemSerializer

from rest_framework import generics
from django.db import models

# Create your views here.
    

class WaterTreeAction(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        
        # adjust level and points
        user.tree_level += 0.1
        user.points_balance -= 10

        return Response({
            "success": True,
            "message": "Water applied successfully",
            "points_balance": user.points_balance,
            "tree_level": user.tree_level,
            "has_snail": False,
        })
    
class SoilTreeAction(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        
        user.tree_level += 0.3
        user.points_balance -= 20

        return Response({
            "success": True,
            "message": "Soil applied successfully",
            "points_balance": user.points_balance,
            "tree_level": user.tree_level,
            "has_snail": False,
        })

class GloveTreeAction(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        
        user.tree_level += 0
        user.points_balance -= 50
        
        return Response({
            "success": True,
            "message": "Glove applied successfully",
            "points_balance": user.points_balance,
            "tree_level": user.tree_level,
            "has_snail": False,
        })


