# Generated by Django 3.2.9 on 2021-12-06 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_alter_product_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='big_image',
            field=models.CharField(max_length=150),
        ),
        migrations.AlterField(
            model_name='product',
            name='small_image',
            field=models.CharField(max_length=150),
        ),
    ]
