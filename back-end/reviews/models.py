from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.deletion import CASCADE
from django.core.validators import MinValueValidator,MaxValueValidator

User = get_user_model()
# Create your models here.
class Review(models.Model):
    owner = models.ForeignKey(User,on_delete=CASCADE)
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1),MaxValueValidator(5)])
    text = models.CharField(max_length=350)
    product = models.ForeignKey("products.Product", on_delete=CASCADE)

    def __str__(self):
        return f'{self.owner.username}\'s review of {self.product.name}'