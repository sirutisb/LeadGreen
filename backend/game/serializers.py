from rest_framework import serializers
from .models import ShopItem, UserItem

class ShopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = ['name', 'effect', 'description', 'cost']

class UserItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserItem
        fields = ['user', 'item', 'quantity']

class GameStateSerializer(serializers.ModelSerializers):
    class Meta:
        model = GameState
        fields = ['tree_level', 'points', 'spins', 'plant', 'snail']