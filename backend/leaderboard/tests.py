from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from game.models import GameProfile, Plant, Insect
from users.models import UserProfile
# from .serializers import UserProfileSerializer
from .serializers import GameProfileLeaderboardSerializer

from django.core.files.uploadedfile import SimpleUploadedFile

class LeaderboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # sample users
        self.user1 = UserProfile.objects.create(username='user1', email='email1@email.com', password='p1', profile_picture=SimpleUploadedFile(
            name='profilepic.jpg',
            content = b'',
            content_type='image/jpeg'
        ))
        self.user2 = UserProfile.objects.create(username='user2', email='email2@email.com', password='p2', profile_picture=SimpleUploadedFile(
            name='profilepic.jpg',
            content = b'',
            content_type='image/jpeg'
        ))
        self.user3 = UserProfile.objects.create(username='user3', email='email3@email.com', password='p3', profile_picture=SimpleUploadedFile(
            name='profilepic.jpg',
            content = b'',
            content_type='image/jpeg'
        ))
        '''
        self.plant1 = Plant.objects.create(name="plant1")
        self.plant2 = Plant.objects.create(name="plant2")
        self.plant3 = Plant.objects.create(name="plant3")
        '''

        #, current_plant=self.plant1

        self.gameuser1 = GameProfile.objects.create(user=self.user1, points_balance=100, lifetime_points=100, tree_level=1, tree_growth=0)
        self.gameuser2 = GameProfile.objects.create(user=self.user2, points_balance=500, lifetime_points=500, tree_level=3, tree_growth=0)
        self.gameuser3 = GameProfile.objects.create(user=self.user3, points_balance=200, lifetime_points=200, tree_level=2, tree_growth=0)
    '''
        self.user1 = UserProfile.objects.create(username='user1', points_balance=100, lifetime_points=500, tree_level=3)
        self.user2 = UserProfile.objects.create(username='user2', points_balance=150, lifetime_points=400, tree_level=4)
        self.user3 = UserProfile.objects.create(username='user3', points_balance=80, lifetime_points=600, tree_level=2)
    '''

        


    def test_list_points_balance(self):
        url = reverse('top-points-balance')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['username'], 'user2')
        self.assertEqual(response.data['results'][1]['username'], 'user1')

    def test_list_lifetime_points(self):
        url = reverse('lifetime-points-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['username'], 'user3')

    '''
    def test_list_tree_level(self):
        url = reverse('tree-level-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['username'], 'user2')

    def test_pagination(self):
        GameProfile.objects.create(username='David', points_balance=200, lifetime_points=300, tree_level=5)
        url = reverse('top-points-balance')
        response = self.client.get(url, {'page_size': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    '''
    def test_serializer(self):
        serializer = GameProfileLeaderboardSerializer(instance=self.user1)
        expected_data = {
            'username': 'user1',
            'points_balance': 100,
            'tree_level': 1,
            'lifetime_points': 100
        }
        self.assertEqual(serializer.data, expected_data)

    def test_urls(self):
        self.assertEqual(reverse('top-points-balance'), '/api/leaderboard/points/')
        self.assertEqual(reverse('tree-level-list'), '/api/leaderboard/tree-level/')
        self.assertEqual(reverse('lifetime-points-list'), '/api/leaderboard/lifetime-points/')
