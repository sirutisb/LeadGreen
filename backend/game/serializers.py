from rest_framework import serializers
from .models import GameProfile, Plant, Insect, Inventory, Item, ItemEffect, Transaction

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = ['id', 'name', 'level', 'image']

class InsectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insect
        fields = ['id', 'name', 'level', 'spawn_chance', 'image']

class GameProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for getting game profile information from frontend
    """
    current_plant = PlantSerializer(read_only=True)
    current_insect = InsectSerializer(read_only=True)

    class Meta:
        model = GameProfile
        fields = ['points_balance', 'tree_level', 'tree_growth', 'current_plant', 'current_insect', 'spins']

class ItemEffectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemEffect
        fields = ['id', 'name', 'effect_type', 'parameters']

class ItemSerializer(serializers.ModelSerializer):
    effects = ItemEffectSerializer(many=True, read_only=True)
    
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'image', 'price', 'item_type', 'effects', 'cooldown_seconds']

class InventorySerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    
    class Meta:
        model = Inventory
        fields = ['item', 'quantity']

class TransactionSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'item', 'quantity', 'total_price', 'timestamp']