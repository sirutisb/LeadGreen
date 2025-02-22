from rest_framework import serializers
from .models import ShopItem, UserItem, GameState

class ShopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = ['name', 'effect', 'description', 'cost']

class UserItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserItem
        fields = ['user', 'item', 'quantity']

class GameStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameState
        fields = ['tree_level', 'growth', 'points', 'spins', 'plant', 'snail']