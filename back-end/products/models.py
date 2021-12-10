from django.db import models

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=120, unique=True)
    price = models.DecimalField(max_digits=5,decimal_places=2)
    # reviews = models.ManyToManyField("reviews.Review")
    category_choices = [
        ('CE', 'Cereal'),
        ('ME', 'Meat'),
        ('DA', 'Dairy'),
        ('SN', 'Snacks'),
        ('FR', 'Frozen'),
        ('DE', 'Dessert'),
        ('PR', 'Produce'),
    ]
    food_category = models.CharField(max_length=2,choices=category_choices)
    big_image = models.CharField(max_length=200)
    small_image = models.CharField(max_length=200)

    def __str__(self) -> str:
        return f'{self.name}'