from django.db import migrations

def populate_insects(apps, schema_editor):
    Insect = apps.get_model('game', 'Insect')
    insects = [
        {'name': 'Buzzly'},
        {'name': 'Creepsy'},
        {'name': 'Chitter'},
        {'name': 'Zigzag'},
        {'name': 'Flutter'},
        {'name': 'Stingster'},
        {'name': 'Munchy'},
        {'name': 'Gnatso'},
        {'name': 'Beetlo'},
        {'name': 'Clicksy'},
        {'name': 'Mosquibo'},
        {'name': 'Nettlebug'},
    ]
    
    for insect_data in insects:
        Insect.objects.create(**insect_data)

def reverse_populate(apps, schema_editor):
    Insect = apps.get_model('game', 'Insect')
    Insect.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0003_auto_20250224_0014'),  # Adjust this to point to your last migration
    ]

    operations = [
        migrations.RunPython(populate_insects, reverse_populate),
    ] 