from rest_framework import serializers
from .models import Cart
from products.serializers import PopulatedProductSerializer

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class PopulatedCartSerializer(CartSerializer):
    order_items = PopulatedProductSerializer(many=True,read_only=True)

