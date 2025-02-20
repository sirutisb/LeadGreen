# backend/leaderboard/views.py
from rest_framework import generics
from .serializers import UserProfileSerializer
from users.models import UserProfile
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# List all users in order of points balance
class list_pointsBalance(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = UserProfile.objects.all().order_by('-points_balance')
        return queryset

# List all users in order of lifetime points
class list_lifetimePoints(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = UserProfile.objects.all().order_by('-lifetime_points')
        return queryset

# List all users in order of tree level
class list_treeLevel(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = UserProfile.objects.all().order_by('-tree_level')
        return queryset