# Generated by Django 3.2.25 on 2024-05-29 20:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
        ('likes', '0002_rename_likes_like'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='like', to='posts.post'),
        ),
    ]
