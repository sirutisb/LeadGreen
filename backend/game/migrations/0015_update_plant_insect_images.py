from django.db import migrations

def update_plant_images(apps, schema_editor):
    Plant = apps.get_model('game', 'Plant')
    # Update each plant's image path
    for plant in Plant.objects.all():
        plant.image = f"plants/plant{plant.level}.svg"
        plant.save()

def update_insect_images(apps, schema_editor):
    Insect = apps.get_model('game', 'Insect')
    # Update each insect's image path
    for insect in Insect.objects.all():
        insect.image = f"insects/insect{insect.id}.svg"
        insect.save()

def reverse_plant_images(apps, schema_editor):
    Plant = apps.get_model('game', 'Plant')
    # Revert each plant's image path to original
    for plant in Plant.objects.all():
        plant.image = f"plants/plant{plant.level}.png"
        plant.save()

def reverse_insect_images(apps, schema_editor):
    Insect = apps.get_model('game', 'Insect')
    # Revert each insect's image path to original
    for insect in Insect.objects.all():
        insect.image = f"insects/insect{insect.id}.png"
        insect.save()

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0014_merge_20250315_0749'),
    ]

    operations = [
        migrations.RunPython(update_plant_images, reverse_plant_images),
        migrations.RunPython(update_insect_images, reverse_insect_images),
    ] 