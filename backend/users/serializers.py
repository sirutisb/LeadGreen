from rest_framework import serializers
from .models import UserProfile

# For use in posts and profile pages etc
class BasicUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'profile_picture']
        read_only_fields = ['id']

class UserWithGameSerializer(serializers.ModelSerializer):
    # Game-related fields from GameProfile
    points_balance = serializers.IntegerField(source='game_profile.points_balance')
    tree_level = serializers.IntegerField(source='game_profile.tree_level')
    current_plant = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'profile_picture', 'points_balance', 'tree_level', 'current_plant']

    def get_current_plant(self, obj):
        # Return a simplified version of the current plant
        plant = obj.game_profile.current_plant
        if plant:
            return {
                'id': plant.id,
                'name': plant.name,
                'level': plant.level,
                'image': plant.image.url if plant.image else None
            }
        return None