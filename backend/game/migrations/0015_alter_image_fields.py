from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('game', '0014_merge_20250315_0749'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plant',
            name='image',
            field=models.CharField(
                max_length=100,
                null=True,
                blank=True,
                help_text="Path to the plant image in static files"
            ),
        ),
        migrations.AlterField(
            model_name='insect',
            name='image',
            field=models.CharField(
                max_length=100,
                null=True,
                blank=True,
                help_text="Path to the insect image in static files"
            ),
        ),
    ] 