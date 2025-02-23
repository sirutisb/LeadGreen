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
    insect_spawn_chance = 0

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile

        if profile.current_insect is not None:
            return Response({
                "success": False,
                "message": "There is an insect on the tree! Remove it first.",
                "points_balance": profile.points_balance,
                "tree_level": profile.plant_level,
                "has_insect": profile.current_insect is not None,
            }, status=status.HTTP_400_BAD_REQUEST)

        # adjust level and points
        if profile.points_balance < self.action_cost:
            return Response({
                "success": False,
                "message": f"Not enough points, you have only {profile.points_balance}, you need {self.action_cost}",
                "points_balance": profile.points_balance,
                "tree_level": profile.plant_level,
                "has_insect": profile.current_insect is not None,
            }, status=status.HTTP_400_BAD_REQUEST)

        profile.plant_growth += self.growth_amount
        while profile.plant_growth >= 1.0:
            profile.plant_growth -= 1.0
            profile.plant_level += 1
        profile.points_balance -= self.action_cost

        # chance for snail to spawn
        # TODO: make it so theres a cooldown and you cant get the snail again for x amount of actions
        if random.random() < self.insect_spawn_chance:
            print("Spawning insect")
            profile.spawn_insect()

        profile.save()


        # # Serialize the updated game profile
        # serializer = GameProfileSerializer(profile)
        # response_data = serializer.data
        # # Optionally add custom messages
        # response_data.update({
        #     "success": True,
        #     "message": "Action applied successfully.",
        # })
        # return Response(response_data, status=status.HTTP_200_OK)

        return Response({
            "success": True,
            "message": "action applied successfully",
            "points_balance": profile.points_balance,
            "tree_level": profile.plant_level,
            "has_insect": profile.current_insect is not None,
        }, status=status.HTTP_200_OK)


class WaterTreeAction(TreeGrowAction):
    action_cost = 10
    growth_amount = 0.1
    insect_spawn_chance = 0.45

class SoilTreeAction(TreeGrowAction):
    action_cost = 20
    growth_amount = 0.3
    insect_spawn_chance = 0.15


# TODO: Make cleaner by inheriting
class GloveTreeAction(APIView):
    action_cost = 50
    growth_amount = 0.0
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile

        if profile.current_insect is None:
            return Response({
                "success": False,
                "message": "Remove what? There is no insect on the tree.",
                "points_balance": profile.points_balance,
                "tree_level": profile.plant_level,
                "has_insect": profile.current_insect is not None,
            }, status=status.HTTP_400_BAD_REQUEST)

        # adjust level and points
        if profile.points_balance < self.action_cost:
            return Response({
                "success": False,
                "message": f"Not enough points, you have only {profile.points_balance}, you need {self.action_cost}",
                "points_balance": profile.points_balance,
                "tree_level": profile.plant_level,
                "has_insect": profile.current_insect is not None,
            }, status=status.HTTP_400_BAD_REQUEST)

        profile.current_insect = None
        profile.plant_growth += self.growth_amount
        while profile.plant_growth >= 1.0:
            profile.plant_growth -= 1.0
            profile.plant_level += 1
        profile.points_balance -= self.action_cost

        profile.save()


        # # Serialize the updated game profile
        # serializer = GameProfileSerializer(profile)
        # response_data = serializer.data
        # # Optionally add custom messages
        # response_data.update({
        #     "success": True,
        #     "message": "Action applied successfully.",
        # })
        # return Response(response_data, status=status.HTTP_200_OK)

        return Response({
            "success": True,
            "message": "action applied successfully",
            "points_balance": profile.points_balance,
            "tree_level": profile.plant_level,
            "has_insect": profile.current_insect is not None,
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
    
