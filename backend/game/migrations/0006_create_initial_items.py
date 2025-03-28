# Generated by Django 5.1.6 on 2025-03-13 11:02

from django.db import migrations

def create_initial_items(apps, schema_editor):
    ItemEffect = apps.get_model('shop', 'ItemEffect')
    Item = apps.get_model('shop', 'Item')

    # Create effects
    water_effect = ItemEffect.objects.create(
        name="Water",
        effect_type='GROW',
        parameters={'growth_amount': 0.1}
    )
    water_spawn = ItemEffect.objects.create(
        name="Water Spawn Chance",
        effect_type='SPAWN_INSECT',
        parameters={'chance': 0.2}
    )
    glove_remove = ItemEffect.objects.create(
        name="Insect Removal",
        effect_type='REMOVE_INSECT',
        parameters={}
    )
    glove_bonus = ItemEffect.objects.create(
        name="Removal Bonus",
        effect_type='ADD_POINTS',
        parameters={'points': 5}
    )

    # Create items
    watering_can = Item.objects.create(
        name="Watering Can",
        description="Waters your tree for growth",
        price=10,
        stock=1000,
        item_type='TOOL'
    )
    watering_can.effects.add(water_effect, water_spawn)

    garden_glove = Item.objects.create(
        name="Garden Gloves",
        description="Removes insects and gives bonus points",
        price=50,
        stock=200,
        item_type='TOOL'
    )
    garden_glove.effects.add(glove_remove, glove_bonus)


def remove_initial_items(apps, schema_editor):
    ItemEffect = apps.get_model('shop', 'ItemEffect')
    Item = apps.get_model('shop', 'Item')
    Item.objects.all().delete()
    ItemEffect.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0005_populate_prizes'),
    ]

    operations = [
        #migrations.RunPython(create_initial_items, remove_initial_items),
    ]
