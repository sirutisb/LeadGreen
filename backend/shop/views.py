from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Item, Inventory, Transaction
from .serializers import ItemSerializer, InventorySerializer, TransactionSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def purchase(self, request, pk=None):
        item = self.get_object()
        quantity = int(request.data.get('quantity', 1))
        
        if quantity <= 0:
            return Response({'error': 'Quantity must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        
        if item.stock < quantity:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

        total_price = item.price * quantity
        
        # Update stock
        item.stock -= quantity
        item.save()

        # Update or create inventory
        inventory, created = Inventory.objects.get_or_create(
            user=request.user,
            item=item,
            defaults={'quantity': quantity}
        )
        if not created:
            inventory.quantity += quantity
            inventory.save()

        # Record transaction
        transaction = Transaction.objects.create(
            user=request.user,
            item=item,
            quantity=quantity,
            total_price=total_price
        )

        return Response({
            'transaction': TransactionSerializer(transaction).data,
            'inventory': InventorySerializer(inventory).data
        }, status=status.HTTP_201_CREATED)

class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Inventory.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def use(self, request, pk=None):
        inventory = self.get_object()
        quantity = int(request.data.get('quantity', 1))
        
        if quantity <= 0:
            return Response({'error': 'Quantity must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        
        if inventory.quantity < quantity:
            return Response({'error': 'Not enough items in inventory'}, status=status.HTTP_400_BAD_REQUEST)

        # Perform item-specific action here (customize based on your needs)
        # Example: if item.name == "Health Potion": increase health
        
        inventory.quantity -= quantity
        if inventory.quantity == 0:
            inventory.delete()
        else:
            inventory.save()

        return Response({
            'message': f'Used {quantity} {inventory.item.name}(s)',
            'remaining': InventorySerializer(inventory).data if inventory.pk else None
        }, status=status.HTTP_200_OK)