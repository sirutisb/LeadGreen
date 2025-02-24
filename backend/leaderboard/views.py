# backend/leaderboard/views.py
from rest_framework import generics
from .serializers import GameProfileLeaderboardSerializer
from game.models import GameProfile
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

#
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class list_pointsBalance(generics.ListAPIView):
    serializer_class = GameProfileLeaderboardSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # Get all GameProfile objects ordered by points balance in descending order
        queryset = GameProfile.objects.all().order_by('-points_balance')
        return queryset

    def list(self, request, *args, **kwargs):
        
        queryset = self.get_queryset()

       
        serializer = self.get_serializer(queryset, many=True)
        
        # Add rank to each user in the serialized data
        ranked_data = []
        for i, user in enumerate(serializer.data, 1):
            user['rank'] = i
            ranked_data.append(user)
        
        
        paginated_data = self.paginate_queryset(ranked_data)
        return self.get_paginated_response(paginated_data)


class list_lifetimePoints(generics.ListAPIView):
    serializer_class = GameProfileLeaderboardSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # Get all GameProfile objects ordered by lifetime points in descending order
        queryset = GameProfile.objects.all().order_by('-lifetime_points')
        return queryset
    
    def list(self, request, *args, **kwargs):
        
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        
        # Add rank to each user in the serialized data
        ranked_data = []
        for i, user in enumerate(serializer.data, 1):
            user['rank'] = i
            ranked_data.append(user)
        
       
        paginated_data = self.paginate_queryset(ranked_data)
        return self.get_paginated_response(paginated_data)


class list_treeLevel(generics.ListAPIView):
    serializer_class = GameProfileLeaderboardSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # Get all GameProfile objects ordered by tree level in descending order
        queryset = GameProfile.objects.all().order_by('-tree_level')
        return queryset
    
    def list(self, request, *args, **kwargs):
        
        queryset = self.get_queryset()

        
        serializer = self.get_serializer(queryset, many=True)
        
        # Add rank to each user in the serialized data
        ranked_data = []
        for i, user in enumerate(serializer.data, 1):
            user['rank'] = i
            ranked_data.append(user)
        
        
        paginated_data = self.paginate_queryset(ranked_data)
        return self.get_paginated_response(paginated_data)