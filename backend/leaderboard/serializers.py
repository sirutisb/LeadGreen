from django.utils import timezone
from rest_framework import serializers, generics
from rest_framework.filters import OrderingFilter
#from django_filters.rest_framework import DjangoFilterBackend
from users.models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['username', 'points_balance', 'tree_level', 'lifetime_points']
        read_only_fields = ['username', 'points_balance', 'tree_level', 'lifetime_points']

class TopPointsBalance(generics.ListAPIView):
    serializer_class = UserProfileSerializer

    def get_queryset(self):
        limit = self.request.query_params.get('limit', 10)
        return UserProfile.objects.all().order_by('-points_balance')[:int(limit)]

# class FilteredPointsBalance(generics.ListAPIView):
#     serializer_class = UserProfileSerializer
#     filter_backends = [DjangoFilterBackend, OrderingFilter]
#     filterset_fields = ['date_joined']
#     ordering_fields = ['points_balance']

    def get_queryset(self):
        queryset = UserProfile.objects.all()
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            queryset = queryset.filter(date_joined__range=[start_date, end_date])
        return queryset.order_by('-points_balance')


