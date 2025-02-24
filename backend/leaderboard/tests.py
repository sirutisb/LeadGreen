from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from users.models import UserProfile
from leaderboard.serializers import UserProfileSerializer

class LeaderboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create sample users
        self.user1 = UserProfile.objects.create(username='Alice', points_balance=100, lifetime_points=500, tree_level=3)
        self.user2 = UserProfile.objects.create(username='Bob', points_balance=150, lifetime_points=400, tree_level=4)
        self.user3 = UserProfile.objects.create(username='Charlie', points_balance=80, lifetime_points=600, tree_level=2)

    def test_list_points_balance(self):
        url = reverse('top-points-balance')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['username'], 'Bob')
        self.assertEqual(response.data['results'][1]['username'], 'Alice')

    def test_list_lifetime_points(self):
        url = reverse('lifetime-points-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['username'], 'Charlie')

    def test_list_tree_level(self):
        url = reverse('tree-level-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['username'], 'Bob')

    def test_pagination(self):
        UserProfile.objects.create(username='David', points_balance=200, lifetime_points=300, tree_level=5)
        url = reverse('top-points-balance')
        response = self.client.get(url, {'page_size': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_serializer(self):
        serializer = UserProfileSerializer(instance=self.user1)
        expected_data = {
            'username': 'Alice',
            'points_balance': 100,
            'tree_level': 3,
            'lifetime_points': 500
        }
        self.assertEqual(serializer.data, expected_data)

    def test_urls(self):
        self.assertEqual(reverse('top-points-balance'), '/api/leaderboard/points/')
        self.assertEqual(reverse('tree-level-list'), '/api/leaderboard/tree-level/')
        self.assertEqual(reverse('lifetime-points-list'), '/api/leaderboard/lifetime-points/')
