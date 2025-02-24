from django.test import TestCase
from django.contrib.auth import get_user_model
from users.models import UserProfile
from rest_framework.test import APITestCase
from rest_framework import status
from .models import GameProfile
from django.urls import reverse

from django.test import TestCase
from users.models import UserProfile
from .models import Plant, Insect


# Create your tests here.



# Create your tests here.


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

