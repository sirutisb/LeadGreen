from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import UserProfile
from random import choice

from django.utils.timezone import now
from django.utils import timezone
from django.conf import settings
from datetime import timedelta

class Plant(models.Model):
    """
    Model for plant, includes name, level, image
    Allows for ordering through level
    """
    name = models.CharField(max_length=32)  # exampe - "Leafy", "Sprouto"
    level = models.IntegerField(unique=True)  # each level - one plant
    image = models.ImageField(
        upload_to="plants/",
        blank=False,
        null=True
    )

    class Meta:
        ordering = ['level']  # Order plants by level

    def __str__(self):
        return f"{self.name} | Level: {self.level}"

class Insect(models.Model):
    """
    Model for insect, include name of bug, level to appear, spawn chance, image
    """
    name = models.CharField(max_length=32)  # example "Buzzly", "Creepsy"
    level = models.IntegerField(default=1)  # level requirement to appear
    spawn_chance = models.FloatField(default=0.2)  # prob of spawning
    image = models.ImageField(
        upload_to="insects/",
        blank=False,
        null=True
    )

    def __str__(self):
        return f"{self.name} | Level: {self.level} | Spawn Chance: {self.spawn_chance}"


class GameProfile(models.Model):
    """
    Game profile model
    Seperate from standard user model - contains other functionality and variables
    Uses one to one relationship to assign each game profile to a user profile
    Includes:
      link to user
      current points, overall lifetime points
      plant level, growth, current plant
      current insect and last insect spawn
      spins remaining for roulette wheel
    """
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='game_profile')
    points_balance = models.IntegerField(default=0)
    lifetime_points = models.IntegerField(default=0)
    spins = models.IntegerField(default=0)
    
    # Plant progress
    tree_level = models.IntegerField(default=1)  # Start at level 1
    tree_growth = models.FloatField(default=0.0)  # Progress towards next level (0.0 to 1.0)
    current_plant = models.ForeignKey(Plant, on_delete=models.PROTECT, null=True, blank=True)
    
    # Insect mechanics
    current_insect = models.ForeignKey(Insect, on_delete=models.SET_NULL, null=True, blank=True)

    # New fields for complex effects
    shield_expires_at = models.DateTimeField(null=True, blank=True)
    combo_multiplier = models.FloatField(default=1.0)
    combo_expires_at = models.DateTimeField(null=True, blank=True)
    point_multiplier = models.FloatField(default=1.0)
    point_multiplier_expires_at = models.DateTimeField(null=True, blank=True)
    growth_speed_multiplier = models.FloatField(default=1.0)
    growth_speed_expires_at = models.DateTimeField(null=True, blank=True)

    def activate_shield(self, duration):
        self.shield_expires_at = timezone.now() + timezone.timedelta(seconds=duration)
        self.save()

    def activate_combo_boost(self, multiplier, duration):
        self.combo_multiplier = multiplier
        self.combo_expires_at = timezone.now() + timezone.timedelta(seconds=duration)
        self.save()

    def activate_point_multiplier(self, multiplier, duration):
        self.point_multiplier = multiplier
        self.point_multiplier_expires_at = timezone.now() + timezone.timedelta(seconds=duration)
        self.save()

    def activate_time_boost(self, multiplier, duration):
        self.growth_speed_multiplier = multiplier
        self.growth_speed_expires_at = timezone.now() + timezone.timedelta(seconds=duration)
        self.save()


    # Daily reward 
    last_collected = models.DateTimeField(null=True, blank=True)
    streak = models.IntegerField(default=0)
    current_day = models.IntegerField(default = 1)

    def add_points(self, amount):
        """Modified to account for point multiplier"""
        if self.point_multiplier_expires_at and self.point_multiplier_expires_at > timezone.now():
            amount *= self.point_multiplier
        if self.combo_expires_at and self.combo_expires_at > timezone.now():
            amount *= self.combo_multiplier
        self.points_balance += int(amount)
        self.lifetime_points += int(amount)
        self.save()

    def grow_tree(self, amount):
        """Modified to account for growth speed multiplier"""
        if self.growth_speed_expires_at and self.growth_speed_expires_at > timezone.now():
            amount *= self.growth_speed_multiplier
        self.tree_growth += amount
        while self.tree_growth >= 1.0:
            self.tree_growth -= 1.0
            self.tree_level += 1
            self.save()

    def save(self, *args, **kwargs):
        # Ensure the plant matches the current tree level
        if not self.current_plant_id or self.current_plant.level != self.tree_level:
            self.current_plant = Plant.objects.get(level=self.tree_level)
        super().save(*args, **kwargs)

    def spawn_insect(self):
        if self.shield_expires_at and self.shield_expires_at > timezone.now():
            return  # Shield prevents insect spawn
        
        # Selects an insect that is at the same level / lower than the tree level
        available_insects = Insect.objects.filter(level__lte=self.tree_level)
        if available_insects.exists():
            self.current_insect = choice(available_insects)
            self.save()

    def can_collect_daily_reward(self):
        """ check if user is allowed to collect next reward"""

        #first time collector
        if not self.last_collected:
            return True
        
        time_diff = now() - self.last_collected

        if time_diff > timedelta(hours = 48):
            self.streak = 0
            self.current_day = 1
        
        return time_diff >= timedelta(hours = 24)
        
    def collect_daily_reward(self):
        """ reward collection """

        # unable to collect - 24 hours not past        
        if not self.can_collect_daily_reward():
            return False

        if self.last_collected:
            time_diff = now() - self.last_collected
        else:
            time_diff = None

        if time_diff and time_diff >= timedelta(hours = 48):
            # if longer than 48 hours - reset streak and current day
            self.streak = 0
            self.current_day = 1
        else:
            # if less than 48 - (greater than 24) - add to streak and enumerate day
            reward = DailyRewardConfig.objects.get(day=self.current_day)

            # add reward based on reward type
            if reward.reward_type == 'ITEM':
                self.add_to_inventory(reward.item, reward.amount)
            elif reward.reward_type == 'SPINS':
                self.spins += reward.amount
            elif reward.reward_type == 'POINTS':
                self.points_balance += reward.amount

            self.streak += 1
            self.current_day = (self.current_day % 7) + 1

        self.last_collected = now()
        self.save()
        return True

    def __str__(self):
        return f"{self.user.username} | Level {self.tree_level} | Points {self.points_balance} | Spins {self.spins}"

    def get_rank(self):
        """Get user's rank based on lifetime points"""
        return GameProfile.objects.filter(
            lifetime_points__gt=self.lifetime_points
        ).count() + 1

    def add_to_inventory(self, item, amount=1):
        """
        Add specified amount of items to user's inventory
        
        Args:
            item (Item): The item to add to inventory
            amount (int): Amount of items to add, defaults to 1
            
        Returns:
            Inventory: The updated or created inventory entry
        """
        try:
            inventory_item = Inventory.objects.get(user=self.user, item=item)
            inventory_item.quantity += amount
            inventory_item.save()
        except Inventory.DoesNotExist:
            inventory_item = Inventory.objects.create(
                user=self.user,
                item=item,
                quantity=amount
            )
        
        return inventory_item
    

@receiver(post_save, sender=UserProfile)
def create_game_profile(sender, instance, created, **kwargs):
    """
    Creates game profile
    Create when user first exists
    """
    if created:  # only when the user is first created
        GameProfile.objects.create(
            user=instance,
            points_balance=100,  # Default starting points
            lifetime_points=100,
            tree_level=1,       # Starting level
            tree_growth=0.0,     # Starting growth
            spins=5
        )

# Connect signal
post_save.connect(create_game_profile, sender=UserProfile)

class Prize(models.Model):
    value = models.IntegerField()
    option = models.CharField(max_length=32)
    weight = models.FloatField()
    style = models.JSONField(default=dict)  # For storing color styles as JSON

#shop Items and transactions
class ItemEffect(models.Model):
    """
    Generic effects that items can have when used
    """
    EFFECT_TYPES = [
        ('GROW', 'Grow Tree'),
        ('REMOVE_INSECT', 'Remove Insect'),
        ('ADD_POINTS', 'Add Points'),
        ('SPAWN_INSECT', 'Spawn Insect'),
        ('SPECIAL', 'Special Effect'),
        ('COMBO_BOOST', 'Combo Boost'),
        ('TEMPORARY_SHIELD', 'Temporary Shield'),
        ('MULTIPLIER', 'Point Multiplier'),
        ('RANDOM_REWARD', 'Random Reward'),
        ('TIME_BOOST', 'Time Boost'),
        # Add effect types as needed
    ]

    name = models.CharField(max_length=64)
    effect_type = models.CharField(max_length=32, choices=EFFECT_TYPES)
    # Store effect parameters as JSON 
    parameters = models.JSONField(default=dict, blank=True, help_text="Effect-specific parameters (e.g. growth_amount, points, chances)")
    
    def __str__(self):
        return f"{self.name} ({self.effect_type})"

class Item(models.Model):
    ITEM_TYPE = [
        ('TOOL', 'Tool'), # tools - always available to use (infinite item count)
        ('CONSUMABLE', 'Consumable'), # Consumables - item is used (limited item count)
        ('SPECIAL', 'Special'), # Special items - effect is applied to the user (to be reworked later)
    ]
    
    name = models.CharField(max_length=32)
    description = models.TextField(default="")
    price = models.IntegerField(default=0)
    image = models.ImageField(
        upload_to="items/",
        blank=False,
        null=True
    )

    item_type = models.CharField(max_length=20, choices=ITEM_TYPE)
    effects = models.ManyToManyField(ItemEffect, related_name='items', blank=True)  # Made optional
    cooldown_seconds = models.IntegerField(default=0)
    # add item specific parameters
    parameters = models.JSONField(default=dict, blank=True, help_text="Item-specific parameters (e.g. growth_amount, spawn_chance)")

    def __str__(self):
        return f"{self.name} | Price: {self.price}"
    
class DailyRewardConfig(models.Model):

    day = models.IntegerField(unique=True)
    
    reward_type = models.CharField(max_length=32, choices=[
        ('POINTS', 'Points'),
        ('SPINS', 'Spins'),
        ('ITEM', 'Item')
    ])

    amount = models.IntegerField()

    item = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['day']

    def __str__(self):
        return f"Day {self.day} - {self.reward_type}"

    
class Inventory(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)

    class Meta:
        unique_together = ['user', 'item']
        verbose_name_plural = "Inventories"

    def __str__(self):
        return f"{self.user.username} -> x{self.quantity} {self.item.name}"

class Transaction(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    total_price = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} bought {self.quantity} {self.item.name}"