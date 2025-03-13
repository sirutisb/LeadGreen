from rest_framework import serializers
from .models import Item, Inventory, Transaction

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'price', 'stock', 'item_type', 'growth_amount', 'insect_spawn_chance']

class InventorySerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    
    class Meta:
        model = Inventory
        fields = ['id', 'item', 'quantity']

class TransactionSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'item', 'quantity', 'total_price', 'timestamp']