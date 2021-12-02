from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Product
from .serializers import ProductSerializer

# Create your views here.


class ProductListView(APIView):
    def get(self,request):
        products = Product.objects.all()
        serialized_prods = ProductSerializer(products, many = True)
        return Response(serialized_prods.data, status = status.HTTP_200_OK)
    
    def post(self, request):
        product = ProductSerializer(data = request.data)
        if product.is_valid():
            product.save()
            return Response(product.data, status = status.HTTP_201_CREATED)
        else:
            return Response(product.errors, status = status.HTTP_422_UNPROCESSABLE_ENTITY)

