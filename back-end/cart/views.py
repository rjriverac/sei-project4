from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CartSerializer,PopulatedCartSerializer
from .models import Cart

# Create your views here.

class CartListView(APIView):
    # permission_classes = (IsAuthenticated,)
    def get(self,request):
        cart = Cart.objects.all()
        print(cart)
        serialized_cart = PopulatedCartSerializer(cart,many=True)
        return Response(serialized_cart.data,status = status.HTTP_200_OK)