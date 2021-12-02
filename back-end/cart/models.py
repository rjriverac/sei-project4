from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    item = models.ForeignKey("products.Product", on_delete= models.CASCADE)
    quantity = models.IntegerField(default = 1)

    def __str__(self):
        plural = 's' if self.quantity > 1 else ''
        return f'{self.user.username} has {self.quantity} {self.item}{plural}' 
