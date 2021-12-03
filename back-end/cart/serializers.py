from rest_framework import serializers
from .models import Cart
from products.serializers import ProductSerializer

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class PopulatedCartSerializer(CartSerializer):
    order_items = ProductSerializer(many=True,read_only=True)
