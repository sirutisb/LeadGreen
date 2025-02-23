from rest_framework import serializers
from .models import ShopItem, UserItem, GameProfile, Plant, Insect

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
        model = GameProfile
        fields = ['points_balance', 'plant_level', 'plant_growth', 'current_plant', 'current_insect', 'spins_remaining']

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = ['name', 'level']

class InsectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insect
        fields = ['name', 'level', 'spawn_chance']