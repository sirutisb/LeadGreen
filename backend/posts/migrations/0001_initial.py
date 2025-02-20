# Generated by Django 5.1.6 on 2025-02-20 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, upload_to='posts/')),
                ('caption', models.CharField(blank=True, max_length=200, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('private', models.BooleanField(default=False)),
                ('approved', models.BooleanField(default=False)),
                ('points_received', models.IntegerField(default=0)),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
    ]
