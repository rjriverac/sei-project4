from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser,IsAuthenticatedOrReadOnly

from .models import Product
from .serializers import PopulatedProductSerializer, ProductSerializer



# Create your views here.


class ProductListView(APIView):
    def get(self,request):
        products = Product.objects.all()
        serialized_prods = PopulatedProductSerializer(products, many = True)
        return Response(serialized_prods.data, status = status.HTTP_200_OK)
    
    def post(self, request):
        self.permission_classes = (IsAdminUser,)
        product = ProductSerializer(data = request.data)
        if product.is_valid():
            product.save()
            return Response(product.data, status = status.HTTP_201_CREATED)
        else:
            return Response(product.errors, status = status.HTTP_422_UNPROCESSABLE_ENTITY)

class ProductDetailView(APIView):
    def get(self,request,pk):
        try:
            self.permission_classes = (IsAuthenticatedOrReadOnly,)
            product = Product.objects.get(id=pk)
            serialized_prod = PopulatedProductSerializer(product)
            return Response(serialized_prod.data, status = status.HTTP_202_ACCEPTED)
        except:
            return Response(status.HTTP_404_NOT_FOUND)

    def delete(self,request,pk):
        self.permission_classes = (IsAdminUser,)
        try:
            product = Product.objects.get(id=pk)
            product.delete()
        except:
            return Response(status = status.HTTP_403_FORBIDDEN)
        
        return Response(status = status.HTTP_204_NO_CONTENT)

    def put(self,request,pk):
        self.permission_classes = (IsAdminUser,)
        try:
            product = Product.objects.get(id=pk)
            updated_prod = ProductSerializer(product, data = request.data, partial = True)
            if updated_prod.is_valid():
                updated_prod.save()
        except:
            return Response(status = status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            return Response(updated_prod.data, status = status.HTTP_202_ACCEPTED)