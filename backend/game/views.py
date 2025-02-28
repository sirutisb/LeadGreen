from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny

from django.shortcuts import get_object_or_404

from .models import GameProfile
from .serializers import GameProfileSerializer, PlantProgressSerializer, InsectSerializer

from rest_framework import generics
from django.db import models

import random

def build_response(profile, success, message, status_code):
    """
    Serapate method to build the response to frontend after game logic complete
    """
    plant_serializer = PlantProgressSerializer(profile)
    insect_data = InsectSerializer(profile.current_insect).data if profile.current_insect is not None else None
    return Response({
        "success": success,
        "message": message,
        "points_balance": profile.points_balance,
        "tree": plant_serializer.data,
        "insect": insect_data
    }, status=status_code)

class TreeGrowAction(APIView):
    """
    APIView
    Holds logic with Tree growth 
    Returns post request based on input from frontend (used soil, water, etc)
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

        # adjust level and points
        if profile.points_balance < self.action_cost:
            return build_response(profile, False, f"Not enough points, you have only {profile.points_balance}, you need {self.action_cost}", status.HTTP_200_OK)

        profile.tree_growth += self.growth_amount
        while profile.tree_growth >= 1.0:
            profile.tree_growth -= 1.0
            profile.tree_level += 1
        profile.points_balance -= self.action_cost

        # chance for snail to spawn
        # TODO: make it so theres a cooldown and you cant get the snail again for x amount of actions
        if random.random() < self.insect_spawn_chance:
            print("Spawning insect")
            profile.spawn_insect()

        try:
            profile.save()
        except:
            pass


        # # Serialize the updated game profile
        # serializer = GameProfileSerializer(profile)
        # response_data = serializer.data
        # # Optionally add custom messages
        # response_data.update({
        #     "success": True,
        #     "message": "Action applied successfully.",
        # })
        # return Response(response_data, status=status.HTTP_200_OK)
        return build_response(profile, True, "Action applied successfully.", status.HTTP_200_OK)


class WaterTreeAction(TreeGrowAction):
    """Child class of tree growth action for water action (different parameters)"""
    action_cost = 10
    growth_amount = 0.1
    insect_spawn_chance = 0.15

class SoilTreeAction(TreeGrowAction):
    """Child class of Tree growth action with different paramters"""
    action_cost = 20
    growth_amount = 0.3
    insect_spawn_chance = 0.01


# TODO: Make cleaner by inheriting
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
        profile.tree_growth += self.growth_amount
        while profile.tree_growth >= 1.0:
            profile.tree_growth -= 1.0
            profile.tree_level += 1
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

        return build_response(profile, True, "Action applied successfully.", status.HTTP_200_OK)



class GameProfileView(APIView):
    """
    Get request made by frontend for the user infomation in db
    """
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile
        serializer = GameProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetPrizes(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        prizes = [
            {"prize": "10 points", "points": 10, "chance": 50},
            {"prize": "50 points", "points": 50, "chance": 30},
            {"prize": "100 points", "points": 100, "chance": 15},
            {"prize": "Jackpot! 5000 points", "points": 5000, "chance": 5},
        ]
        return Response({"success": True, "prizes": prizes}, status=status.HTTP_200_OK)

class SpinView(APIView):
    """
    APIview for spin
    Request to perform a spin action
    """
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        
        user = request.user
        game_profile = user.game_profile
        points_won = request.data.get('points')
        
        if game_profile.spins_remaining <= 0: # if not more spins remaining - cant spin
            return Response({ 
                "success": False,
                "message": "You have no spins left!",
                "spins": game_profile.spins_remaining,
                "points_balance": game_profile.points_balance,
            }, status=status.HTTP_200_OK)
        
        elif points_won == 0: # if no points won - return info
                game_profile.spins_remaining -= 1
                game_profile.save()
                return Response({
                    "success": True,
                    "message": "Better luck next time! No points won.",
                    "spins": game_profile.spins_remaining,
                    "points_balance": game_profile.points_balance,
                }, status=status.HTTP_200_OK)
        else: # if spin valid + points are won - return amount of points won
            game_profile.lifetime_points += points_won
            game_profile.points_balance += points_won
            game_profile.spins_remaining -= 1
            game_profile.save()
            return Response({
                "success": True,
                "message": f"Congratulations! You won {points_won} points!",
                "spins": game_profile.spins_remaining,
                "points_balance": game_profile.points_balance,
            }, status=status.HTTP_200_OK)
            
