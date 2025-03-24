# Generated by Django 5.1.6 on 2025-03-24 14:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0014_merge_20250315_0749'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyRewardConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.IntegerField(unique=True)),
                ('reward_type', models.CharField(choices=[('POINTS', 'Points'), ('SPINS', 'Spins'), ('ITEM', 'Item')], max_length=32)),
                ('amount', models.IntegerField()),
                ('item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='game.item')),
            ],
            options={
                'ordering': ['day'],
            },
        ),
    ]
