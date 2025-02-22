from django.test import TestCase
from game.models import ShopItem, UserItem, GameState
from datetime import datetime

# Create your tests here.

class ShopItemModelTest(TestCase):
    # set up post test 
    def setUp(self):
        self.shopItem = ShopItem.object.create(
            name = "Water",
            effect = "Waters plant",
            description = "Water that makes the plant grow more."
            cost = 50;
        )

    def testShopItemCreation(self):
        shopItem = self.shopItem
        self.assertEqual(shop_item.name, "Water")
        self.assertEqual(shop_item.effect, "Waters plant")
        self.assertEqual(shop_item.description, "Water that makes the plant grow more.")
        self.assertEqual(shop_item.cost, 50)
    
    def testDefaultValues(self):
        shopItem = ShopItem.objects.create(name = "Example")

        self.assertEqual(ShopItem.effect, "")
        self.assertEqual(ShopItem.description, "")
        self.assertEqual(ShopItem.cost, 0)
    
    def testInvalidCost(self):
        with self.assertRaises(ValueError):
            ShopItem.objects.create(name="Invalid Item", cost = -10)

class UserItemModelTest(TestCase):
    pass

class GameStateModelTest(TestCase):
    pass