# Generated by Django 5.1.6 on 2025-03-12 23:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='cooldown_seconds',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='item',
            name='growth_amount',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='item',
            name='insect_spawn_chance',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='item',
            name='item_type',
            field=models.CharField(choices=[('GROWTH', 'Growth'), ('WATER', 'Water'), ('SOIL', 'Soil'), ('GLOVE', 'Glove'), ('FERTILIZER', 'Fertilizer'), ('SPECIAL', 'Special'), ('UNDEFINED', 'Undefined')], default='UNDEFINED', max_length=20),
        ),
        migrations.AddField(
            model_name='item',
            name='special_effects',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
