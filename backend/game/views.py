from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny

from django.shortcuts import get_object_or_404

from .models import GameProfile, Prize
from .serializers import GameProfileSerializer, PlantProgressSerializer, InsectSerializer
from shop.models import Inventory
from shop.serializers import InventorySerializer

from rest_framework import generics
from django.db import models

import random

def build_response(profile, success, message, status_code):
    # Serialize the updated game profile
    serializer = GameProfileSerializer(profile)
    response_data = serializer.data
    
    # Add inventory information
    inventory = Inventory.objects.filter(user=profile.user)
    inventory_serializer = InventorySerializer(inventory, many=True)
    
    # Add custom messages and inventory
    response_data.update({
        "success": success,
        "message": message,
        "inventory": inventory_serializer.data
    })
    return Response(response_data, status=status_code)

class ItemBasedAction(APIView):
    """
    Base class for actions that consume items from inventory
    """
    permission_classes = [IsAuthenticated]
    required_item_type = None

    def get_inventory_item(self, user):
        try:
            inventory = Inventory.objects.get(
                user=user.game_profile.user,
                item__item_type=self.required_item_type
            )
            if inventory.quantity <= 0:
                return None, f"You don't have any {self.required_item_type.lower()} items!"
            return inventory, None
        except Inventory.DoesNotExist:
            return None, f"You don't have any {self.required_item_type.lower()} items!"

    def consume_item(self, inventory):
        inventory.quantity -= 1
        if inventory.quantity == 0:
            inventory.delete()
        else:
            inventory.save()

class TreeGrowAction(ItemBasedAction):
    """
    Generic class for tree growth actions using items from inventory
    """
    def post(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile

        if profile.current_insect is not None:
            return build_response(profile, False, "There is an insect on the tree! Remove it first.", status.HTTP_200_OK)

        # Get and validate inventory item
        inventory, error_message = self.get_inventory_item(user)
        if error_message:
            return build_response(profile, False, error_message, status.HTTP_200_OK)

        # Get item effects
        item = inventory.item
        
        # Consume the item
        self.consume_item(inventory)

        # Apply growth effect
        profile.grow_tree(item.growth_amount)

        # Check for insect spawn
        if random.random() < item.insect_spawn_chance:
            print("Spawning insect")
            profile.spawn_insect()

        try:
            profile.save()
        except:
            print("ERROR! Could not save profile!")
            pass

        return build_response(profile, True, f"Used {item.name} successfully!", status.HTTP_200_OK)

class WaterTreeAction(TreeGrowAction):
    """Implementation of Tree Watering Action using water items"""
    required_item_type = 'WATER'

class SoilTreeAction(TreeGrowAction):
    """Implementation of Tree Soil Action using soil items"""
    required_item_type = 'SOIL'

class GloveTreeAction(ItemBasedAction):
    """Implementation of Glove Action using glove items"""
    required_item_type = 'GLOVE'

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile

        if profile.current_insect is None:
            return build_response(profile, False, "Remove what? There is no insect on the tree.", status.HTTP_200_OK)

        # Get and validate inventory item
        inventory, error_message = self.get_inventory_item(user)
        if error_message:
            return build_response(profile, False, error_message, status.HTTP_200_OK)

        # Get item
        item = inventory.item

        # Consume the item
        self.consume_item(inventory)

        # Remove insect and apply any growth effect
        profile.current_insect = None
        if item.growth_amount > 0:
            profile.grow_tree(item.growth_amount)
        
        profile.save()

        return build_response(profile, True, f"Used {item.name} successfully!", status.HTTP_200_OK)

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