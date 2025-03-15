from django.test import TestCase
from users.models import UserProfile

from django.urls import reverse

from django.test import TestCase
from .models import Plant, Insect, GameProfile
from users.models import UserProfile
from .models import Plant, Insect

# for testing API calls in views later
from rest_framework.test import APITestCase
from rest_framework import status

class GameModelTest(TestCase):
    def setUp(self):
        self.user = UserProfile.objects.create(username='testuser')
        self.plant1 = Plant.objects.create(name='Leafy', level=999)
        self.plant2 = Plant.objects.create(name='Sprouto', level=998)
        self.insect1 = Insect.objects.create(name='Buzzly', level=997, spawn_chance=0.5)
        self.insect2 = Insect.objects.create(name='Creepsy', level=996, spawn_chance=0.3)
        self.game_profile = GameProfile.objects.get(user=self.user) 

    def test_create_game_profile(self):
        self.assertIsNotNone(self.game_profile)
        self.assertEqual(self.game_profile.user, self.user)
        self.assertEqual(self.game_profile.points_balance, 100)
        self.assertEqual(self.game_profile.tree_level, 1)
        self.assertEqual(self.game_profile.tree_growth, 0.0)