from rest_framework import serializers
from .models import GameProfile, Plant, Insect

# class ShopItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ShopItem
#         fields = ['name', 'effect', 'description', 'cost']

# class UserItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserItem
#         fields = ['user', 'item', 'quantity']

class PlantProgressSerializer(serializers.Serializer):
    name = serializers.CharField(source='current_plant.name')
    level = serializers.IntegerField(source='plant_level')
    growth = serializers.FloatField(source='plant_growth')
    image = serializers.ImageField(source='current_plant.image')

class InsectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insect
        fields = ['name', 'level', 'spawn_chance', 'image']

    def to_representation(self, instance):
        if instance is None:
            return None
        return super().to_representation(instance)

class GameProfileSerializer(serializers.ModelSerializer):
    plant = PlantProgressSerializer(source='*')  # source='*' means use the GameProfile instance itself
    #insect = InsectSerializer(source='current_insect')
    insect = InsectSerializer(source='current_insect')

    class Meta:
        model = GameProfile
        fields = ['points_balance', 'plant', 'insect', 'spins_remaining']