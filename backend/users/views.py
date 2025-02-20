from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer

@api_view(['GET'])
def getUserProfile(request, pk):
    try:
        user = UserProfile.objects.get(id=pk)
        serializer = UserProfileSerializer(user, many=False)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)