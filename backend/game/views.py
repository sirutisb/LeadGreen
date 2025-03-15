from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny

from django.shortcuts import get_object_or_404

from .models import GameProfile, Prize, Item, Inventory, Transaction
from .serializers import GameProfileSerializer, PlantProgressSerializer, InsectSerializer, InventorySerializer, ItemSerializer, TransactionSerializer

from rest_framework import generics
from django.db import models

from django.utils.timezone import now

import random

from rest_framework import viewsets
from rest_framework.decorators import action

def build_response(profile, success, message, status_code):
    # Serialize the updated game profile
    serializer = GameProfileSerializer(profile)
    response_data = serializer.data
    
    # add inventory information
    inventory = Inventory.objects.filter(user=profile.user)
    inventory_serializer = InventorySerializer(inventory, many=True)
    
    # add custom messages and inventory
    response_data.update({
        "success": success,
        "message": message,
        "inventory": inventory_serializer.data
    })
    return Response(response_data, status=status_code)

class UseItemView(APIView):
    """
    Generic view for using any item from inventory
    """
    permission_classes = [IsAuthenticated]

    def get_inventory_item(self, user, item_id):
        try:
            inventory = Inventory.objects.get(
                user=user.game_profile.user,
                item_id=item_id
            )
            if inventory.quantity <= 0:
                return None, f"You don't have any of this item!"
            return inventory, None
        except Inventory.DoesNotExist:
            return None, f"You don't have this item in your inventory!"

    def consume_item(self, inventory):
        inventory.quantity -= 1
        if inventory.quantity == 0:
            inventory.delete()
        else:
            inventory.save()

    def apply_effects(self, profile, item):
        """Apply all effects of an item"""
        messages = []
        
        # Apply item-specific parameters if exist
        if item.parameters:
            if 'growth_amount' in item.parameters:
                profile.grow_tree(item.parameters['growth_amount'])
                messages.append(f"Tree grown by {item.parameters['growth_amount']}")
            
            if 'spawn_chance' in item.parameters and random.random() < item.parameters['spawn_chance']:
                profile.spawn_insect()
                messages.append("An insect has appeared!")
        
        #  apply any linked effects
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

            elif effect.effect_type == 'COMBO_BOOST':
                combo_multiplier = params.get('multiplier', 1.5)
                duration = params.get('duration_seconds', 300)
                profile.activate_combo_boost(combo_multiplier, duration)
                messages.append(f"Combo boost activated! x{combo_multiplier} for {duration/60} minutes")

            elif effect.effect_type == 'TEMPORARY_SHIELD':
                duration = params.get('duration_seconds', 600)
                profile.activate_shield(duration)
                messages.append(f"Shield active for {duration/60} minutes")

            elif effect.effect_type == 'MULTIPLIER':
                multiplier = params.get('multiplier', 2)
                duration = params.get('duration_seconds', 300)
                profile.activate_point_multiplier(multiplier, duration)
                messages.append(f"Point multiplier x{multiplier} active for {duration/60} minutes")

            elif effect.effect_type == 'RANDOM_REWARD':
                rewards = params.get('rewards', [
                    {'type': 'points', 'amount': 100, 'weight': 70},
                    {'type': 'growth', 'amount': 0.5, 'weight': 20},
                    {'type': 'spins', 'amount': 1, 'weight': 10}
                ])
                reward = self.apply_random_reward(profile, rewards)
                messages.append(f"Random reward: {reward}")

            elif effect.effect_type == 'TIME_BOOST':
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

    def post(self, request, item_id):
        user = request.user
        profile = user.game_profile

        # Get and validate inventory item
        inventory, error_message = self.get_inventory_item(user, item_id)
        if error_message:
            return build_response(profile, False, error_message, status.HTTP_200_OK)

        item = inventory.item
        
        # Check prerequisites - existing insect?
        # insects block all actions that don't remove insects
        if profile.current_insect is not None and not item.effects.filter(effect_type='REMOVE_INSECT').exists():
            return build_response(profile, False, "There is an insect on the tree! Use an appropriate item first.", status.HTTP_200_OK)

        # Consume the item
        self.consume_item(inventory)

        effect_messages = self.apply_effects(profile, item)
        
        try:
            profile.save()
        except Exception as e:
            print(f"ERROR! Could not save profile: {e}")
            return build_response(profile, False, "An error occurred while applying the item effects.", status.HTTP_500_INTERNAL_SERVER_ERROR)

        return build_response(profile, True, f"Used {item.name}: {', '.join(effect_messages)}", status.HTTP_200_OK)

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
    

# TODO: reuse functions to avoid response code duplication
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
        
        # select random prize based on weights
        prize_index = random.choices(range(len(prizes)), weights=[prize["weight"] for prize in prizes], k=1)[0]
        prize_reward = prizes[prize_index]["value"]

        #No points won
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
        else: # won points
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

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by('price')  # order by price
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]  # anyone can view shop items

    def list(self, request, *args, **kwargs):
        """List all available items in the shop"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Get user's point balance if authenticated
        points_balance = request.user.game_profile.points_balance if request.user.is_authenticated else 0
        
        return Response({
            "success": True,
            "items": serializer.data,
            "points": points_balance
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def purchase(self, request, pk=None):
        """Purchase an item (requires authentication)"""
        if not request.user.is_authenticated:
            return Response({
                "success": False,
                "message": "Authentication required to purchase items"
            }, status=status.HTTP_401_UNAUTHORIZED)

        item = self.get_object()
        quantity = int(request.data.get('quantity', 1))
        
        if quantity <= 0:
            return Response({
                "success": False,
                "message": "Quantity must be positive"
            }, status=status.HTTP_400_BAD_REQUEST)

        total_price = item.price * quantity
        user_profile = request.user.game_profile

        #Check if user has enough points
        if user_profile.points_balance < total_price:
            return Response({
                "success": False,
                "message": f"Not enough points! You need {total_price} points but have {user_profile.points_balance}",
                "required_points": total_price,
                "current_points": user_profile.points_balance
            }, status=status.HTTP_400_BAD_REQUEST)

        # Deduct points
        user_profile.points_balance -= total_price
        user_profile.save()

        # update / create inventory
        inventory, created = Inventory.objects.get_or_create(
            user=request.user,
            item=item,
            defaults={'quantity': quantity}
        )
        if not created:
            inventory.quantity += quantity
            inventory.save()

        # record transaction
        transaction = Transaction.objects.create(
            user=request.user,
            item=item,
            quantity=quantity,
            total_price=total_price
        )

        return Response({
            "success": True,
            "message": f"Successfully purchased {quantity} {item.name}(s)",
            "transaction": TransactionSerializer(transaction).data,
            "inventory": InventorySerializer(inventory).data,
            "remaining_points": user_profile.points_balance
        }, status=status.HTTP_201_CREATED)

class WaterTreeAction(APIView):
    """Wrapper for water item usage to maintain frontend compatibility"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        #Assuming water item has ID 1
        return UseItemView().post(request, item_id=4)

class SoilTreeAction(APIView):
    """Wrapper for soil item usage to maintain frontend compatibility"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # Assuming soil item has ID 2
        return UseItemView().post(request, item_id=5)

class GloveTreeAction(APIView):
    """Wrapper for glove item usage to maintain frontend compatibility"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # assuming glove item has ID 3
        return UseItemView().post(request, item_id=6)

class InventoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    viewSet for viewing user's inventory
    """
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Inventory.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

reward_day_cycle = {
    1 : {"reward": "water", "amount" : 5},
    2 : {"reward": "spin", "amount" : 2},
    3 : {"reward": "soil", "amount" : 3},
    4 : {"reward": "spin", "amount" : 4},
    5 : {"reward": "glove", "amount" : 2},
    6 : {"reward": "spin", "amount" : 6},
    7 : {"reward": "pest", "amount" : 2},
}

class DailyRewardView(APIView):
    permission_classes = [IsAuthenticated]

    # fetch info from database on daily reward info

    def get(self, request):
        user = request.user
        profile = user.game_profile

        # get user information
        can_collect = profile.can_collect_daily_reward()
        current_day = profile.current_day

        reward_response = []

        # build reward response information
        for day in range(1, 8):
            reward_info = reward_day_cycle[day]

            is_collected = day < current_day
            can_collect_today = can_collect and day == profile.current_day


            reward_response.append({
                "day": day,
                "reward": reward_info["reward"],
                "amount": reward_info["amount"],
                "isCollected": is_collected,
                "canCollect": can_collect_today
            })

        return Response(reward_response, status=status.HTTP_200_OK)
    
    def post(self, request):
        user = request.user
        profile = user.game_profile

        # if cant collect
        if not profile.can_collect_daily_reward():
            return Response(
                {"message": "Reward not available"},
                status = status.HTTP_400_BAD_REQUEST
            )
        
        profile.collect_daily_reward()

        return Response({"message": "Reward collected"}, status=status.HTTP_200_OK)

class StreakView(APIView):
    """ get response for user current streak"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.game_profile

        return Response({"streak": profile.streak}, status = status.HTTP_200_OK)
