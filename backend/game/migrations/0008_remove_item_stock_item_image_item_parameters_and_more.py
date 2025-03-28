# Generated by Django 5.1.6 on 2025-03-14 00:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0007_remove_gameprofile_last_insect_spawn'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='stock',
        ),
        migrations.AddField(
            model_name='item',
            name='image',
            field=models.ImageField(null=True, upload_to='items/'),
        ),
        migrations.AddField(
            model_name='item',
            name='parameters',
            field=models.JSONField(default=dict, help_text='Item-specific parameters (e.g. growth_amount, spawn_chance)'),
        ),
        migrations.AlterField(
            model_name='item',
            name='effects',
            field=models.ManyToManyField(blank=True, related_name='items', to='game.itemeffect'),
        ),
    ]
