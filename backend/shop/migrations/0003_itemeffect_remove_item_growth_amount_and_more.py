# Generated by Django 5.1.6 on 2025-03-13 00:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_item_cooldown_seconds_item_growth_amount_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ItemEffect',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('effect_type', models.CharField(choices=[('GROW', 'Grow Tree'), ('REMOVE_INSECT', 'Remove Insect'), ('ADD_POINTS', 'Add Points'), ('SPAWN_INSECT', 'Spawn Insect'), ('SPECIAL', 'Special Effect')], max_length=32)),
                ('parameters', models.JSONField(default=dict, help_text='Effect-specific parameters (e.g. growth_amount, points, chances)')),
            ],
        ),
        migrations.RemoveField(
            model_name='item',
            name='growth_amount',
        ),
        migrations.RemoveField(
            model_name='item',
            name='insect_spawn_chance',
        ),
        migrations.RemoveField(
            model_name='item',
            name='special_effects',
        ),
        migrations.AlterField(
            model_name='item',
            name='item_type',
            field=models.CharField(choices=[('TOOL', 'Tool'), ('CONSUMABLE', 'Consumable'), ('SPECIAL', 'Special')], max_length=20),
        ),
        migrations.AddField(
            model_name='item',
            name='effects',
            field=models.ManyToManyField(related_name='items', to='shop.itemeffect'),
        ),
    ]
