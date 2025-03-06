from rest_framework import serializers
from .models import GameProfile, Plant, Insect, ShopItem, UserItem

class ShopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = ['name', 'effect', 'description', 'cost']

class UserItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserItem
        fields = ['user', 'item', 'quantity']

class PlantProgressSerializer(serializers.Serializer):
    """
    Create serializer for getting plant information from frontend
    """
    name = serializers.CharField(source='current_plant.name')
    level = serializers.IntegerField(source='tree_level')
    growth = serializers.FloatField(source='tree_growth')
    image = serializers.ImageField(source='current_plant.image')

class InsectSerializer(serializers.ModelSerializer):
    """
    Serializer for getting insect information from frontend
    """
    class Meta:
        model = Insect
        fields = ['name', 'level', 'spawn_chance', 'image']

    def to_representation(self, instance):
        if instance is None:
            return None
        return super().to_representation(instance)

class GameProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for getting game profile information from frontend
    """
    tree = PlantProgressSerializer(source='*')  # source='*' means use the GameProfile instance itself
    insect = InsectSerializer(source='current_insect')

    class Meta:
        model = GameProfile
        fields = ['points_balance', 'tree', 'insect', 'spins']