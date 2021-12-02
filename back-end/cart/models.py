from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    order_items = models.ManyToManyField("products.Product")

    def __str__(self):
        return f'{self.user.username} has {self.order_items} in their cart' 
