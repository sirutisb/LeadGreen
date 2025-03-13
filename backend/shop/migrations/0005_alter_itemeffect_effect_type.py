# Generated by Django 5.1.6 on 2025-03-13 11:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0004_create_initial_items'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemeffect',
            name='effect_type',
            field=models.CharField(choices=[('GROW', 'Grow Tree'), ('REMOVE_INSECT', 'Remove Insect'), ('ADD_POINTS', 'Add Points'), ('SPAWN_INSECT', 'Spawn Insect'), ('SPECIAL', 'Special Effect'), ('COMBO_BOOST', 'Combo Boost'), ('TEMPORARY_SHIELD', 'Temporary Shield'), ('MULTIPLIER', 'Point Multiplier'), ('RANDOM_REWARD', 'Random Reward'), ('TIME_BOOST', 'Time Boost')], max_length=32),
        ),
    ]
