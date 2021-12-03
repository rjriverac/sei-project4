from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CartSerializer,PopulatedCartSerializer
from .models import Cart
from .permissions import IsOwnerOrReadOnly
# Create your views here.

class CartListView(APIView):
    # permission_classes = (IsAuthenticated,)
    def get(self,request):
        cart = Cart.objects.all()
        print(cart)
        serialized_cart = PopulatedCartSerializer(cart,many=True)
        return Response(serialized_cart.data,status = status.HTTP_200_OK)

class CartDetailView(APIView):
    permission_classes = (IsOwnerOrReadOnly,)

    def get(self,request):
        try:
            cart = Cart.objects.get(user=request.user.id)
            serialized_cart = PopulatedCartSerializer(cart)
            total = cart.get_total()
            cart_with_total = {**serialized_cart.data,'total':cart.get_total()}
            return Response(cart_with_total,status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)