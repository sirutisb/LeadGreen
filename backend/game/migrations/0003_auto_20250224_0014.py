from django.db import migrations

def populate_plants(apps, schema_editor):
    Plant = apps.get_model('game', 'Plant')
    plants = [
        {'level': 1, 'name': 'Leafy'},
        {'level': 2, 'name': 'Sprouto'},
        {'level': 3, 'name': 'Thorny'},
        {'level': 4, 'name': 'Fuzzbloom'},
        {'level': 5, 'name': 'Budster'},
        {'level': 6, 'name': 'Twigsy'},
        {'level': 7, 'name': 'Fernie'},
        {'level': 8, 'name': 'Petali'},
        {'level': 9, 'name': 'Saply'},
        {'level': 10, 'name': 'Bloomy'},
        {'level': 11, 'name': 'Vineo'},
        {'level': 12, 'name': 'Frondie'},
        {'level': 13, 'name': 'Stemy'},
        {'level': 14, 'name': 'Pluff'},
        {'level': 15, 'name': 'Verdan'},
        {'level': 16, 'name': 'Bristle'},
        {'level': 17, 'name': 'Mossby'},
        {'level': 18, 'name': 'Cloverly'},
        {'level': 19, 'name': 'Tendril'},
        {'level': 20, 'name': 'Barky'},
        {'level': 21, 'name': 'Snappy'},
        {'level': 22, 'name': 'Willoof'},
        {'level': 23, 'name': 'Sporey'},
        {'level': 24, 'name': 'Drifty'},
        {'level': 25, 'name': 'Wispvine'},
        {'level': 26, 'name': 'Chloro'},
        {'level': 27, 'name': 'Gloomeaf'},
        {'level': 28, 'name': 'Puffern'},
        {'level': 29, 'name': 'Grassy'},
        {'level': 30, 'name': 'Blushy'},
        {'level': 31, 'name': 'Bramby'},
        {'level': 32, 'name': 'Tuffin'},
        {'level': 33, 'name': 'Nettle'},
        {'level': 34, 'name': 'Whispen'},
        {'level': 35, 'name': 'Zestem'},
        {'level': 36, 'name': 'Lushie'},
        {'level': 37, 'name': 'Fiddleaf'},
        {'level': 38, 'name': 'Stalky'},
        {'level': 39, 'name': 'Thornlet'},
        {'level': 40, 'name': 'Dewie'},
        {'level': 41, 'name': 'Rootie'},
        {'level': 42, 'name': 'Glowbloom'},
        {'level': 43, 'name': 'Jungleaf'},
        {'level': 44, 'name': 'Saplet'},
        {'level': 45, 'name': 'Shrubbly'},
        {'level': 46, 'name': 'Berris'},
        {'level': 47, 'name': 'Murkbud'},
        {'level': 48, 'name': 'Fluffer'},
        {'level': 49, 'name': 'Shadee'},
        {'level': 50, 'name': 'Pettal'},
        {'level': 51, 'name': 'Frosto'},
        {'level': 52, 'name': 'Creepvine'},
        {'level': 53, 'name': 'Tendri'},
        {'level': 54, 'name': 'Dandy'},
        {'level': 55, 'name': 'Wanderfern'},
        {'level': 56, 'name': 'Mistybloom'},
        {'level': 57, 'name': 'Waggly'},
        {'level': 58, 'name': 'Frilleaf'},
        {'level': 59, 'name': 'Quirko'},
        {'level': 60, 'name': 'Verdini'},
    ]
    
    for plant_data in plants:
        Plant.objects.create(**plant_data)

def reverse_populate(apps, schema_editor):
    Plant = apps.get_model('game', 'Plant')
    Plant.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0002_initial'),  # This should point to your last migration
    ]

    operations = [
        migrations.RunPython(populate_plants, reverse_populate),
    ] 