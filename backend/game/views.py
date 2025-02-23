from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

from django.shortcuts import get_object_or_404

from .models import GameProfile
from .serializers import GameProfileSerializer

from rest_framework import generics
from django.db import models

import random

# Create your views here.

class TreeGrowAction(APIView):
    permission_classes = [IsAuthenticated]
    action_cost = 0
    growth_amount = 0
    snail_chance = 0

    def post(self, request, *args, **kwargs):
        user = request.user
        
        if user.has_snail:
            return Response({
                "success": False,
                "message": "There is a snail on the tree! Remove it first.",
                "points_balance": user.points_balance,
                "tree_level": user.tree_level,
                "has_snail": user.has_snail,
            }, status=status.HTTP_400_BAD_REQUEST)

        # adjust level and points
        if user.points_balance < self.action_cost:
            return Response({
                "success": False,
                "message": f"Not enough points, you have only {user.points_balance}, you need {self.action_cost}",
                "points_balance": user.points_balance,
                "tree_level": user.tree_level,
                "has_snail": user.has_snail,
            }, status=status.HTTP_400_BAD_REQUEST)

        user.tree_growth += self.growth_amount
        while user.tree_growth >= 1.0:
            user.tree_growth -= 1.0
            user.tree_level += 1
        user.points_balance -= self.action_cost

        # chance for snail to spawn
        # TODO: make it so theres a cooldown and you cant get the snail again for x amount of actions
        if random.random() < self.snail_chance:
            user.has_snail = True

        user.save()

        return Response({
            "success": True,
            "message": "action applied successfully",
            "points_balance": user.points_balance,
            "tree_level": user.tree_level,
            "has_snail": user.has_snail,
        }, status=status.HTTP_200_OK)


class WaterTreeAction(TreeGrowAction):
    action_cost = 10
    growth_amount = 0.1
    snail_chance = 0.45

class SoilTreeAction(TreeGrowAction):
    action_cost = 20
    growth_amount = 0.3
    snail_chance = 0.15


# TODO: Make cleaner by inheriting
class GloveTreeAction(APIView):
    action_cost = 50
    growth_amount = 0.0
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        user = request.user
        
        if not user.has_snail:
            return Response({
                "success": False,
                "message": "There is no snail to remove!",
                "points_balance": user.points_balance,
                "tree_level": user.tree_level,
                "has_snail": user.has_snail,
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # adjust level and points
        if (user.points_balance < self.action_cost):
            return Response({
                "success": False,
                "message": f"Not enough points, you have only {user.points_balance}, you need {self.action_cost}",
                "points_balance": user.points_balance,
                "tree_level": user.tree_level,
                "has_snail": user.has_snail,
            }, status=status.HTTP_400_BAD_REQUEST)

        user.has_snail = False
        user.tree_growth += self.growth_amount
        while user.tree_growth >= 1.0:
            user.tree_growth -= 1.0
            user.tree_level += 1
        user.points_balance -= self.action_cost
        user.save()

        return Response({
            "success": True,
            "message": "action applied successfully",
            "points_balance": user.points_balance,
            "tree_level": user.tree_level,
            "has_snail": user.has_snail,
        }, status=status.HTTP_200_OK)



class GameProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile
        serializer = GameProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)



# Original GameProfileView
# class GameProfileView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request, *args, **kwargs):
#         user = request.user
#         profile = user.game_profile
#         #profile = GameProfile.objects.get(user=user)
#         serializer = GameProfileSerializer(profile)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    
