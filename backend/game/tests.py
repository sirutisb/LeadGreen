from django.test import TestCase
from users.models import UserProfile

from django.urls import reverse

from django.test import TestCase
from .models import Plant, Insect, GameProfile
from users.models import UserProfile
from .models import Plant, Insect, ShopItem, UserItem

# for testing API calls in views later
from rest_framework.test import APITestCase
from rest_framework import status

"""
class ShopItemTestCase(TestCase):

    # add shop item to DB - test if DB stores expected results
    def test_shop_item_create(self):
        item = ShopItem.objects.create(
            name="item1",
            effect="item1effect",
            description="item1description",
            cost=50
        )

        self.assertEqual(item.name, "item1")
        self.assertEqual(item.effect, "item1effect")
        self.assertEqual(item.description, "item1description")
        self.assertEqual(item.cost, 50)
        self.assertEqual(str(item), "item1 - 50 points")


class UserItemTestCase(TestCase):

    # add user item to DB - test if DB stores expected results
    def test_user_item_create(self):
        user = UserProfile.objects.create(username="testname")
        item = ShopItem.objects.create(
            name="item1", 
            effect="item1effect", 
            description="item1description", 
            cost=50
            )
        
        user_item = UserItem.objects.create(user=user, item=item, quantity=1)

        self.assertEqual(user_item.user, user)
        self.assertEqual(user_item.item, item)

        self.assertEqual(user_item.quantity, 1)
        self.assertEqual(str(user_item), "testname - x1 item1")
"""

class GameModelTest(TestCase):
    def setUp(self):
        self.user = UserProfile.objects.create(username='testuser')
        self.plant1 = Plant.objects.create(name='Leafy', level=1)
        self.plant2 = Plant.objects.create(name='Sprouto', level=2)
        self.insect1 = Insect.objects.create(name='Buzzly', level=1, spawn_chance=0.5)
        self.insect2 = Insect.objects.create(name='Creepsy', level=2, spawn_chance=0.3)
        self.game_profile = GameProfile.objects.get(user=self.user) 

    def test_create_game_profile(self):
        self.assertIsNotNone(self.game_profile)
        self.assertEqual(self.game_profile.user, self.user)
        self.assertEqual(self.game_profile.points_balance, 100)
        self.assertEqual(self.game_profile.tree_level, 1)
        self.assertEqual(self.game_profile.tree_growth, 0.0)