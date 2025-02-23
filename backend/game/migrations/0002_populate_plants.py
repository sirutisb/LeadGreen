from django.db import migrations

def populate_plants(apps, schema_editor):
    Plant = apps.get_model('game', 'Plant')
    plants = [
        {'level': 1, 'name': 'Leafy', 'image': 'plants/plant1.svg'},
        {'level': 2, 'name': 'Sprouto', 'image': 'plants/plant2.svg'},
        {'level': 3, 'name': 'Thorny', 'image': 'plants/plant3.svg'},
        {'level': 4, 'name': 'Fuzzbloom', 'image': 'plants/plant4.svg'},
        {'level': 5, 'name': 'Budster', 'image': 'plants/plant5.svg'},
        {'level': 6, 'name': 'Twigsy', 'image': 'plants/plant6.svg'},
        {'level': 7, 'name': 'Fernie', 'image': 'plants/plant7.svg'},
        {'level': 8, 'name': 'Petali', 'image': 'plants/plant8.svg'},
        {'level': 9, 'name': 'Saply', 'image': 'plants/plant9.svg'},
        {'level': 10, 'name': 'Bloomy', 'image': 'plants/plant10.svg'},
        {'level': 11, 'name': 'Vineo', 'image': 'plants/plant11.svg'},
        {'level': 12, 'name': 'Frondie', 'image': 'plants/plant12.svg'},
        {'level': 13, 'name': 'Stemy', 'image': 'plants/plant13.svg'},
        {'level': 14, 'name': 'Pluff', 'image': 'plants/plant14.svg'},
        {'level': 15, 'name': 'Verdan', 'image': 'plants/plant15.svg'},
        {'level': 16, 'name': 'Bristle', 'image': 'plants/plant16.svg'},
        {'level': 17, 'name': 'Mossby', 'image': 'plants/plant17.svg'},
        {'level': 18, 'name': 'Cloverly', 'image': 'plants/plant18.svg'},
        {'level': 19, 'name': 'Tendril', 'image': 'plants/plant19.svg'},
        {'level': 20, 'name': 'Barky', 'image': 'plants/plant20.svg'},
        {'level': 21, 'name': 'Snappy', 'image': 'plants/plant21.svg'},
        {'level': 22, 'name': 'Willoof', 'image': 'plants/plant22.svg'},
        {'level': 23, 'name': 'Sporey', 'image': 'plants/plant23.svg'},
        {'level': 24, 'name': 'Drifty', 'image': 'plants/plant24.svg'},
        {'level': 25, 'name': 'Wispvine', 'image': 'plants/plant25.svg'},
        {'level': 26, 'name': 'Chloro', 'image': 'plants/plant26.svg'},
        {'level': 27, 'name': 'Gloomeaf', 'image': 'plants/plant27.svg'},
        {'level': 28, 'name': 'Puffern', 'image': 'plants/plant28.svg'},
        {'level': 29, 'name': 'Grassy', 'image': 'plants/plant29.svg'},
        {'level': 30, 'name': 'Blushy', 'image': 'plants/plant30.svg'},
        {'level': 31, 'name': 'Bramby', 'image': 'plants/plant31.svg'},
        {'level': 32, 'name': 'Tuffin', 'image': 'plants/plant32.svg'},
        {'level': 33, 'name': 'Nettle', 'image': 'plants/plant33.svg'},
        {'level': 34, 'name': 'Whispen', 'image': 'plants/plant34.svg'},
        {'level': 35, 'name': 'Zestem', 'image': 'plants/plant35.svg'},
        {'level': 36, 'name': 'Lushie', 'image': 'plants/plant36.svg'},
        {'level': 37, 'name': 'Fiddleaf', 'image': 'plants/plant37.svg'},
        {'level': 38, 'name': 'Stalky', 'image': 'plants/plant38.svg'},
        {'level': 39, 'name': 'Thornlet', 'image': 'plants/plant39.svg'},
        {'level': 40, 'name': 'Dewie', 'image': 'plants/plant40.svg'},
        {'level': 41, 'name': 'Rootie', 'image': 'plants/plant41.svg'},
        {'level': 42, 'name': 'Glowbloom', 'image': 'plants/plant42.svg'},
        {'level': 43, 'name': 'Jungleaf', 'image': 'plants/plant43.svg'},
        {'level': 44, 'name': 'Saplet', 'image': 'plants/plant44.svg'},
        {'level': 45, 'name': 'Shrubbly', 'image': 'plants/plant45.svg'},
        {'level': 46, 'name': 'Berris', 'image': 'plants/plant46.svg'},
        {'level': 47, 'name': 'Murkbud', 'image': 'plants/plant47.svg'},
        {'level': 48, 'name': 'Fluffer', 'image': 'plants/plant48.svg'},
        {'level': 49, 'name': 'Shadee', 'image': 'plants/plant49.svg'},
        {'level': 50, 'name': 'Pettal', 'image': 'plants/plant50.svg'},
        {'level': 51, 'name': 'Frosto', 'image': 'plants/plant51.svg'},
        {'level': 52, 'name': 'Creepvine', 'image': 'plants/plant52.svg'},
        {'level': 53, 'name': 'Tendri', 'image': 'plants/plant53.svg'},
        {'level': 54, 'name': 'Dandy', 'image': 'plants/plant54.svg'},
        {'level': 55, 'name': 'Wanderfern', 'image': 'plants/plant55.svg'},
        {'level': 56, 'name': 'Mistybloom', 'image': 'plants/plant56.svg'},
        {'level': 57, 'name': 'Waggly', 'image': 'plants/plant57.svg'},
        {'level': 58, 'name': 'Frilleaf', 'image': 'plants/plant58.svg'},
        {'level': 59, 'name': 'Quirko', 'image': 'plants/plant59.svg'},
        {'level': 60, 'name': 'Verdini', 'image': 'plants/plant60.svg'},
    ]
    
    for plant_data in plants:
        Plant.objects.create(**plant_data)

def reverse_populate(apps, schema_editor):
    Plant = apps.get_model('game', 'Plant')
    Plant.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0001_initial'),  # Adjust if you've added a new migration for ImageField
    ]

    operations = [
        migrations.RunPython(populate_plants, reverse_populate),
    ]