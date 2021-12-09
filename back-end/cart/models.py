from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    order_items = models.ManyToManyField("products.Product",related_name="cartItem",blank=True)

    def __str__(self):
        return f'{self.user.username}\'s Cart'

    def get_total(self):
        total = 0
        for each_item in self.order_items.all():
            total += each_item.price
        return '{:.2f}'.format(total)

    def clear_cart(self):
        self.order_items.clear()
        return self
