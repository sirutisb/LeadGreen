from django.test import TestCase
from django.urls import reverse
from users.models import UserProfile
from .models import Plant, Insect, GameProfile, Prize, ItemEffect, Item, DailyRewardConfig, Inventory, Transaction

# for testing API calls in views later
from rest_framework.test import APITestCase
from rest_framework import status

from django.contrib.auth import get_user_model

from django.utils import timezone
from datetime import timedelta

class PlantModelTest(TestCase):
    def setUp(self):
        self.plant = Plant.objects.create(
            name="Leafy",
            level=999, # avoid unique constraint of level
            image=None
        )

    def test_plant_creation(self):
        # check plant was made succesfully
        self.assertTrue(isinstance(self.plant, Plant))
        self.assertEqual(str(self.plant), "Leafy | Level: 999")

class InsectModelTest(TestCase):
    def setUp(self):
        self.insect = Insect.objects.create(
            name="Buzzly",
            level=1,
            spawn_chance=0.2,
            image=None
        )

    def test_insect_creation(self):
        #check insect model was made successfully
        self.assertTrue(isinstance(self.insect, Insect))
        self.assertEqual(str(self.insect), "Buzzly | Level: 1 | Spawn Chance: 0.2")

class GameProfileModelTest(TestCase):
    def setUp(self):
        #Create user
        UserProfile = get_user_model()
        self.user = UserProfile.objects.create_user(
            username='testuser', 
            password='password'
        )
        
        # get game profile from test user
        self.game_profile = self.user.game_profile

    def test_game_profile_creation(self):
        # check test user game profile has correct defaults
        self.assertEqual(self.game_profile.points_balance, 100)
        self.assertEqual(self.game_profile.lifetime_points, 100)
        self.assertEqual(self.game_profile.tree_level, 1)
        self.assertEqual(self.game_profile.spins, 5)

    def test_add_points(self):
        # test if adding points adds to current and lifetime (they recieved points)
        initial_balance = self.game_profile.points_balance

        self.game_profile.add_points(50)

        self.assertEqual(self.game_profile.points_balance, initial_balance + 50)
        self.assertEqual(self.game_profile.lifetime_points, initial_balance + 50)

    def test_grow_tree(self):

        # check tree growth mechanics
        initial_level = self.game_profile.tree_level
        initial_growth = self.game_profile.tree_growth
        
        
        # grow tree to edge of next level - check growth
        self.game_profile.grow_tree(0.9)
        self.assertEqual(self.game_profile.tree_growth, initial_growth + 0.9)
        
        # grow to hit the next level
        self.game_profile.grow_tree(0.2)
        self.assertAlmostEqual(self.game_profile.tree_growth, initial_growth + 0.1) # floating point precision bug - use almost equal
        self.assertEqual(self.game_profile.tree_level, initial_level + 1)

class ItemEffectModelTest(TestCase):
    # create test item
    def setUp(self):
        self.item_effect = ItemEffect.objects.create(
            name = "TestGrow",
            effect_type="GROW",
            parameters={"growth_amount": 0.5}
        )

    def test_item_effect_creation(self):
        # test item effect object was created
        self.assertTrue(isinstance(self.item_effect, ItemEffect))
        self.assertEqual(str(self.item_effect), "TestGrow (GROW)")

class ItemModelTest(TestCase):
    def setUp(self):
        self.item = Item.objects.create(
            name="TestFertilizer",
            description="TestDesc",
            price=100,
            item_type="CONSUMABLE"
        )

    def test_item_creation(self):
        # test item created as expected
        self.assertTrue(isinstance(self.item, Item))
        self.assertEqual(str(self.item), "TestFertilizer | Price: 100")

class InventoryModelTest(TestCase):
    def setUp(self):
        # Create user
        UserProfile = get_user_model()
        self.user = UserProfile.objects.create_user(
            username='testuser', 
            password='12345'
        )
        
        #create item
        self.item = Item.objects.create(
            name="TestItem",
            item_type="CONSUMABLE"
        )
        
        #create inv
        self.inventory = Inventory.objects.create(
            user=self.user,
            item=self.item,
            quantity=5
        )

    def test_inventory_creation(self):
        # test inventory model creation
        self.assertTrue(isinstance(self.inventory, Inventory))
        self.assertEqual(str(self.inventory), "testuser -> x5 TestItem")

class TransactionModelTest(TestCase):
    def setUp(self):
        # create test user
        UserProfile = get_user_model()
        self.user = UserProfile.objects.create_user(
            username='testuser', 
            password='12345'
        )
        
        # Create item
        self.item = Item.objects.create(
            name="TestItem",
            price=50,
            item_type="CONSUMABLE"
        )
        
        # create transaction
        self.transaction = Transaction.objects.create(
            user=self.user,
            item=self.item,
            quantity=2,
            total_price=100
        )

    def test_transaction_creation(self):
        # test transaction creates
        self.assertTrue(isinstance(self.transaction, Transaction))
        self.assertEqual(str(self.transaction), "testuser bought 2 TestItem")

class DailyRewardConfigTest(TestCase):
    def setUp(self):
        # create daily reward configurations
        self.reward = DailyRewardConfig.objects.create(
            day=1,
            reward_type="POINTS",
            amount=100
        )

    def test_daily_reward_config_creation(self):
        """Test DailyRewardConfig model creation"""
        # test the config was created
        self.assertTrue(isinstance(self.reward, DailyRewardConfig))
        self.assertEqual(str(self.reward), "Day 1 - POINTS")