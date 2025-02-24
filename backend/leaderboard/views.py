# backend/leaderboard/views.py
from rest_framework import generics
from .serializers import GameProfileSerializer
from game.models import GameProfile
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = 'page_size'
    max_page_size = 100

# List all users in order of points balance
class list_pointsBalance(generics.ListAPIView):
    serializer_class = GameProfileSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = GameProfile.objects.all().order_by('-points_balance')
        return queryset

    def list(self, request, *args, **kwargs):
        
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        
        ranked_data = []
        for i, user in enumerate(serializer.data, 1):
            user['rank'] = i
            ranked_data.append(user)
        paginated_data = self.paginate_queryset(ranked_data)
        return self.get_paginated_response(paginated_data)

# List all users in order of lifetime points
class list_lifetimePoints(generics.ListAPIView):
    serializer_class = GameProfileSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = GameProfile.objects.all().order_by('-lifetime_points')
        return queryset
    
    def list(self, request, *args, **kwargs):
        
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        
        ranked_data = []
        for i, user in enumerate(serializer.data, 1):
            user['rank'] = i
            ranked_data.append(user)
        paginated_data = self.paginate_queryset(ranked_data)
        return self.get_paginated_response(paginated_data)

# List all users in order of tree level
class list_treeLevel(generics.ListAPIView):
    serializer_class = GameProfileSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = GameProfile.objects.all().order_by('-tree_level')
        return queryset
    
    def list(self, request, *args, **kwargs):
        
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        
        ranked_data = []
        for i, user in enumerate(serializer.data, 1):
            user['rank'] = i
            ranked_data.append(user)
        paginated_data = self.paginate_queryset(ranked_data)
        return self.get_paginated_response(paginated_data)