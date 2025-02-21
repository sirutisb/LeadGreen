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

class ShopItems(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShopItemSerializer

    def get_queryset(self):
        queryset = ShopItem.objects.all()
        return queryset
    
class UseActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        action_name = request.data.get("item")

        item = get_object_or_404(ShopItem, name=action_name) # get item

        if action_name == "water":
            user.tree_level += 0.1
            user.points_balance -= 10
            message = "Tree watered successfully"
        if action_name == "soil":
            user.tree_level += 0.3
            user.points_balance -= 20
            message = ""
        
        user.save()

        return Response({
            "success": True,
            "message": f"{message}",
            "points_balance": user.points_balance,

        })
