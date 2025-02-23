from django.db import migrations

def populate_insects(apps, schema_editor):
    Insect = apps.get_model('game', 'Insect')
    insects = [
        {'name': 'Buzzly', 'level': 1, 'spawn_chance': 0.2, 'image': 'insects/insect1.svg'},
        {'name': 'Creepsy', 'level': 2, 'spawn_chance': 0.2, 'image': 'insects/insect2.svg'},
        {'name': 'Chitter', 'level': 3, 'spawn_chance': 0.2, 'image': 'insects/insect3.svg'},
        {'name': 'Zigzag', 'level': 4, 'spawn_chance': 0.2, 'image': 'insects/insect4.svg'},
        {'name': 'Flutter', 'level': 5, 'spawn_chance': 0.2, 'image': 'insects/insect5.svg'},
        {'name': 'Stingster', 'level': 6, 'spawn_chance': 0.2, 'image': 'insects/insect6.svg'},
        {'name': 'Munchy', 'level': 7, 'spawn_chance': 0.2, 'image': 'insects/insect7.svg'},
        {'name': 'Gnatso', 'level': 8, 'spawn_chance': 0.2, 'image': 'insects/insect8.svg'},
        {'name': 'Beetlo', 'level': 9, 'spawn_chance': 0.2, 'image': 'insects/insect9.svg'},
        {'name': 'Clicksy', 'level': 10, 'spawn_chance': 0.2, 'image': 'insects/insect10.svg'},
        {'name': 'Mosquibo', 'level': 11, 'spawn_chance': 0.2, 'image': 'insects/insect11.svg'},
        {'name': 'Nettlebug', 'level': 12, 'spawn_chance': 0.2, 'image': 'insects/insect12.svg'},
    ]
    
    for insect_data in insects:
        Insect.objects.create(**insect_data)

def reverse_populate(apps, schema_editor):
    Insect = apps.get_model('game', 'Insect')
    Insect.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0002_populate_plants'),  # Adjust if you've added a migration for Insect's ImageField
    ]

    operations = [
        migrations.RunPython(populate_insects, reverse_populate),
    ]