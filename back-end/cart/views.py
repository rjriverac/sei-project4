from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CartSerializer,PopulatedCartSerializer
from .models import Cart
from .permissions import IsOwnerOrReadOnly
# Create your views here.

class CartListView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self,request):
        cart = Cart.objects.all()
        print(cart)
        serialized_cart = PopulatedCartSerializer(cart,many=True)
        return Response(serialized_cart.data,status = status.HTTP_200_OK)

    def post(self,request):
        try:
            cart = Cart.objects.get(user=request.user.id)
        except Cart.DoesNotExist:
            newcart = CartSerializer(data={'user': request.user.id })
            if newcart.is_valid():
                newcart.save()
                return Response(data={'message':'Cart successfully created'})
        else:
            return Response(data={'message': 'cart already exists'},status=status.HTTP_400_BAD_REQUEST)


class CartDetailView(APIView):
    permission_classes = (IsOwnerOrReadOnly,)

    def get(self,request):
        try:
            cart = Cart.objects.get(user=request.user.id)
        except Cart.DoesNotExist:
            raise NotFound()

        serialized_cart = PopulatedCartSerializer(cart)
        total = cart.get_total()
        cart_with_total = {**serialized_cart.data,'total':cart.get_total()}
        return Response(cart_with_total,status=status.HTTP_200_OK)


    def put(self,request):
        try:
            cart = Cart.objects.get(user=request.user.id)
        except Cart.DoesNotExist:
            raise NotFound()
        print(request.data)
        updated_cart = PopulatedCartSerializer(cart, data = request.data, partial=True)
        try:
            if updated_cart.is_valid():
                print(updated_cart.data)
                updated_cart.save()
                return Response(updated_cart.data,status = status.HTTP_200_OK)
        except:
            return Response({'message':'something went wrong'},status=status.HTTP_304_NOT_MODIFIED)

