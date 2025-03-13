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

from rest_framework import viewsets
from rest_framework.decorators import action

from .models import Inventory
from .serializers import InventorySerializer

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

    def apply_effects(self, profile, item):
        """Apply all effects of an item"""
        messages = []
        
        for effect in item.effects.all():
            params = effect.parameters
            
            if effect.effect_type == 'GROW':
                if 'growth_amount' in params:
                    profile.grow_tree(params['growth_amount'])
                    messages.append(f"Tree grown by {params['growth_amount']}")
                    
            elif effect.effect_type == 'REMOVE_INSECT':
                if profile.current_insect:
                    profile.current_insect = None
                    messages.append("Insect removed")
                    
            elif effect.effect_type == 'ADD_POINTS':
                if 'points' in params:
                    profile.add_points(params['points'])
                    messages.append(f"Added {params['points']} points")
                    
            elif effect.effect_type == 'SPAWN_INSECT':
                if 'chance' in params and random.random() < params['chance']:
                    profile.spawn_insect()
                    messages.append("An insect has appeared!")

            # New complex effects
            elif effect.effect_type == 'COMBO_BOOST':
                # Combo system that multiplies points based on consecutive successful actions
                combo_multiplier = params.get('multiplier', 1.5)
                duration = params.get('duration_seconds', 300)  # 5 minutes default
                profile.activate_combo_boost(combo_multiplier, duration)
                messages.append(f"Combo boost activated! x{combo_multiplier} for {duration/60} minutes")

            elif effect.effect_type == 'TEMPORARY_SHIELD':
                # Prevents insect spawning for a duration
                duration = params.get('duration_seconds', 600)  # 10 minutes default
                profile.activate_shield(duration)
                messages.append(f"Shield active for {duration/60} minutes")

            elif effect.effect_type == 'MULTIPLIER':
                # Multiplies points earned for a duration
                multiplier = params.get('multiplier', 2)
                duration = params.get('duration_seconds', 300)
                profile.activate_point_multiplier(multiplier, duration)
                messages.append(f"Point multiplier x{multiplier} active for {duration/60} minutes")

            elif effect.effect_type == 'RANDOM_REWARD':
                # Gives random rewards based on configured probabilities
                rewards = params.get('rewards', [
                    {'type': 'points', 'amount': 100, 'weight': 70},
                    {'type': 'growth', 'amount': 0.5, 'weight': 20},
                    {'type': 'spins', 'amount': 1, 'weight': 10}
                ])
                reward = self.apply_random_reward(profile, rewards)
                messages.append(f"Random reward: {reward}")

            elif effect.effect_type == 'TIME_BOOST':
                # Speeds up growth rate for a duration
                speed_multiplier = params.get('speed_multiplier', 2)
                duration = params.get('duration_seconds', 300)
                profile.activate_time_boost(speed_multiplier, duration)
                messages.append(f"Growth speed increased by x{speed_multiplier} for {duration/60} minutes")
                
        return messages

    def apply_random_reward(self, profile, rewards):
        """Helper method to handle random rewards"""
        weights = [r['weight'] for r in rewards]
        chosen = random.choices(rewards, weights=weights, k=1)[0]
        
        if chosen['type'] == 'points':
            profile.add_points(chosen['amount'])
            return f"Won {chosen['amount']} points!"
        elif chosen['type'] == 'growth':
            profile.grow_tree(chosen['amount'])
            return f"Tree grown by {chosen['amount']}"
        elif chosen['type'] == 'spins':
            profile.spins += chosen['amount']
            profile.save()
            return f"Won {chosen['amount']} spins!"

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = user.game_profile

        # Get and validate inventory item
        inventory, error_message = self.get_inventory_item(user)
        if error_message:
            return build_response(profile, False, error_message, status.HTTP_200_OK)

        # Get item
        item = inventory.item
        
        # Check prerequisites (like existing insect)
        if profile.current_insect is not None and not item.effects.filter(effect_type='REMOVE_INSECT').exists():
            return build_response(profile, False, "There is an insect on the tree! Use an appropriate item first.", status.HTTP_200_OK)

        # Consume the item
        self.consume_item(inventory)

        # Apply all effects
        effect_messages = self.apply_effects(profile, item)
        
        try:
            profile.save()
        except Exception as e:
            print(f"ERROR! Could not save profile: {e}")
            return build_response(profile, False, "An error occurred while applying the item effects.", status.HTTP_500_INTERNAL_SERVER_ERROR)

        return build_response(profile, True, f"Used {item.name}: {', '.join(effect_messages)}", status.HTTP_200_OK)

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

        # Get item
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
        if hasattr(item, 'growth_amount') and item.growth_amount > 0:
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

class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Inventory.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def use(self, request, pk=None):
        inventory = self.get_object()
        quantity = int(request.data.get('quantity', 1))
        
        if quantity <= 0:
            return Response({'error': 'Quantity must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        
        if inventory.quantity < quantity:
            return Response({'error': 'Not enough items in inventory'}, status=status.HTTP_400_BAD_REQUEST)

        # Perform item-specific action here (customize based on your needs)
        # Example: if item.name == "Health Potion": increase health
        
        inventory.quantity -= quantity
        if inventory.quantity == 0:
            inventory.delete()
        else:
            inventory.save()

        return Response({
            'message': f'Used {quantity} {inventory.item.name}(s)',
            'remaining': InventorySerializer(inventory).data if inventory.pk else None
        }, status=status.HTTP_200_OK)
    

    
#ss
from .models import Item, Transaction
from .serializers import ItemSerializer, TransactionSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def purchase(self, request, pk=None):
        item = self.get_object()
        quantity = int(request.data.get('quantity', 1))
        
        if quantity <= 0:
            return Response({'error': 'Quantity must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        
        if item.stock < quantity:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

        total_price = item.price * quantity
        
        # Update stock
        item.stock -= quantity
        item.save()

        # Update or create inventory
        inventory, created = Inventory.objects.get_or_create(
            user=request.user,
            item=item,
            defaults={'quantity': quantity}
        )
        if not created:
            inventory.quantity += quantity
            inventory.save()

        # Record transaction
        transaction = Transaction.objects.create(
            user=request.user,
            item=item,
            quantity=quantity,
            total_price=total_price
        )

        return Response({
            'transaction': TransactionSerializer(transaction).data,
            'inventory': InventorySerializer(inventory).data
        }, status=status.HTTP_201_CREATED)