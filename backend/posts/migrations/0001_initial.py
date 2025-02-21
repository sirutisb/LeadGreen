# Generated by Django 5.1.6 on 2025-02-21 00:50

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
                ('image', models.ImageField(upload_to='posts/')),
                ('caption', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('private', models.BooleanField(default=False)),
                ('qr_code', models.CharField(max_length=32)),
                ('approved', models.BooleanField(default=None, null=True)),
                ('points_received', models.IntegerField(default=0)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
