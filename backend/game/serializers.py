from rest_framework import serializers
from .models import GameProfile, Plant, Insect

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

    # Override to explicitly return None if no insect is present
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


from .models import Item, ItemEffect, Inventory, Transaction

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