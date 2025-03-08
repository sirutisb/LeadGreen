from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny

from django.shortcuts import get_object_or_404

from .models import GameProfile, Prize
from .serializers import GameProfileSerializer, PlantProgressSerializer, InsectSerializer

from rest_framework import generics
from django.db import models

import random

def build_response(profile, success, message, status_code):
    # Serialize the updated game profile
    serializer = GameProfileSerializer(profile)
    response_data = serializer.data
    # Add custom messages
    response_data.update({
        "success": success,
        "message": message,
    })
    return Response(response_data, status=status_code)

class TreeGrowAction(APIView):
    """
    APIView
    Generic class for tree growth actions
    Returns response based on input from API requests (used soil, water, etc)
    """
    
    permission_classes = [IsAuthenticated]
    action_cost = 0
    growth_amount = 0
    insect_spawn_chance = 0

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile # instance of gameprofile model

        if profile.current_insect is not None:
            return build_response(profile, False, "There is an insect on the tree! Remove it first.", status.HTTP_200_OK)

        if profile.points_balance < self.action_cost:
            return build_response(profile, False, f"Not enough points, you have only {profile.points_balance}, you need {self.action_cost}", status.HTTP_200_OK)

        # adjust level and points
        profile.points_balance -= self.action_cost
        profile.grow_tree(self.growth_amount)
        profile.save()

        # chance for snail to spawn
        # TODO: make it so theres a cooldown and you cant get the snail again for x amount of actions
        if random.random() < self.insect_spawn_chance:
            print("Spawning insect")
            profile.spawn_insect()

        try:
            profile.save()
        except:
            # Probably max level, this could possibly occur due to other reasons also
            print("ERROR! Could not save profile!")
            pass

        return build_response(profile, True, "Action applied successfully.", status.HTTP_200_OK)

class WaterTreeAction(TreeGrowAction):
    """Implementation of Tree Watering Action with different parameters"""
    action_cost = 10
    growth_amount = 0.1
    insect_spawn_chance = 0.20

class SoilTreeAction(TreeGrowAction):
    """Implementation of Tree Soil Action with different parameters"""
    action_cost = 20
    growth_amount = 0.3
    insect_spawn_chance = 0.0001

# TODO: Make cleaner
class GloveTreeAction(APIView):
    """
    Glove action too different from soil + water to be child class of Tree Growth
    Returns post request removing the insect and changing state in db - if there is insect
    if no insect exists - returns this fact
    """
    action_cost = 50
    growth_amount = 0.0
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile

        if profile.current_insect is None:
            return build_response(profile, False, "Remove what? There is no insect on the tree.", status.HTTP_200_OK)

        # adjust level and points
        if profile.points_balance < self.action_cost:
            return build_response(profile, False, f"Not enough points, you have only {profile.points_balance}, you need {self.action_cost}", status.HTTP_200_OK)

        profile.current_insect = None
        profile.points_balance -= self.action_cost
        profile.grow_tree(self.growth_amount)
        profile.save()

        return build_response(profile, True, "Action applied successfully.", status.HTTP_200_OK)

class GameProfileView(APIView):
    """
    Get request from an authenticated user to get their game profile state data
    """
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile
        serializer = GameProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


def get_prize_list():
    return list(Prize.objects.all().values())

class GetPrizes(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        prizes = get_prize_list()
        return Response({"success": True, "prizes": prizes}, status=status.HTTP_200_OK)
    

# TODO: Reuse functions to avoid response code duplication
class SpinView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile

        prizes = get_prize_list()

        if profile.spins <= 0:
            return Response({
                "success": False,
                "message": "You have no spins left!",
                "spins": profile.spins,
                "points_balance": profile.points_balance,
                "prize_amount": 0,
            }, status=status.HTTP_200_OK)
        
        # Select random prize based on weights
        prize_index = random.choices(range(len(prizes)), weights=[prize["weight"] for prize in prizes], k=1)[0]
        prize_reward = prizes[prize_index]["value"]

        # No points won
        if prize_reward == 0:
            profile.spins -= 1
            profile.save()
            return Response({
                "success": True,
                "message": "Better luck next time! No points won.",
                "spins": profile.spins,
                "points_balance": profile.points_balance,
                "prize_index": prize_index,
                "prize_amount": prize_reward,
            }, status=status.HTTP_200_OK)
        else: # Won points
            profile.add_points(prize_reward)
            profile.spins -= 1
            profile.save()
            return Response({
                "success": True,
                "message": f"Congratulations! You won {prize_reward}!",
                "spins": profile.spins,
                "points_balance": profile.points_balance,
                "prize_index": prize_index,
                "prize_amount": prize_reward,
            }, status=status.HTTP_200_OK)