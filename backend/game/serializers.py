from rest_framework import serializers
from .models import ShopItem, UserItem, UserGameProfile

class ShopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = ['name', 'effect', 'description', 'cost']

class UserItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserItem
        fields = ['user', 'item', 'quantity']

class GameProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGameProfile
        fields = ['tree_level', 'tree_growth', 'points_balance', 'spins',        'has_snail']
