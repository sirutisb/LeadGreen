from django.utils import timezone
from rest_framework import serializers, generics
from rest_framework.filters import OrderingFilter
#from django_filters.rest_framework import DjangoFilterBackend
from users.models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['username', 'points_balance', 'tree_level', 'lifetime_points', ]
        read_only_fields = [ 'username', 'points_balance', 'tree_level', 'lifetime_points']
