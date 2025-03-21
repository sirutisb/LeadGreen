from django.db import migrations, models

def update_plant_images(apps, schema_editor):
    Plant = apps.get_model('game', 'Plant')
    for plant in Plant.objects.all():
        # If image is None or empty, set a default
        if not plant.image:
            plant.image = f"plants/plant{plant.level}.svg"
        # If image is a full media URL or path, extract just the filename
        elif '/' in plant.image:
            plant.image = f"plants/plant{plant.level}.svg"
        plant.save()

def update_insect_images(apps, schema_editor):
    Insect = apps.get_model('game', 'Insect')
    for insect in Insect.objects.all():
        # If image is None or empty, set a default
        if not insect.image:
            insect.image = f"insects/insect{insect.id}.svg"
        # If image is a full media URL or path, extract just the filename
        elif '/' in insect.image:
            insect.image = f"insects/insect{insect.id}.svg"
        insect.save()

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0015_alter_image_fields'),
    ]

    operations = [
        # First update all image paths
        migrations.RunPython(update_plant_images),
        migrations.RunPython(update_insect_images),
        
        # Then make the fields non-nullable with defaults
        migrations.AlterField(
            model_name='plant',
            name='image',
            field=models.CharField(
                max_length=100,
                default="plants/plant1.svg",
                help_text="Path to the plant image in static files"
            ),
        ),
        migrations.AlterField(
            model_name='insect',
            name='image',
            field=models.CharField(
                max_length=100,
                default="insects/insect1.svg",
                help_text="Path to the insect image in static files"
            ),
        ),
    ] 