from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CartSerializer,PopulatedCartSerializer
from .models import Cart
from .permissions import IsOwnerOrReadOnly
from products.models import Product
# Create your views here.

class CartListView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self,request):
        cart = Cart.objects.all()
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
    permission_classes = (IsOwnerOrReadOnly,IsAuthenticated)
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
            newcart = CartSerializer(data={'user': request.user.id })
            if newcart.is_valid():
                newcart.save()
        if request.data.get('operation') == 'add':
            try:
                current_cart = list(cart.order_items.all())
                new_cart_items = request.data.get('order_items')
                combined_carts = list(dict.fromkeys(current_cart+new_cart_items))
                try:
                    cart.order_items.set(combined_carts)
                    return Response(PopulatedCartSerializer(cart).data,status=status.HTTP_200_OK)
                except:
                    return Response({'message':'set did not work'},status = status.HTTP_418_IM_A_TEAPOT)
            except:
                Response({'message': 'Something went wrong with adding your items'},status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        if request.data.get('operation') == 'remove':
            try:
                current_cart = list(cart.order_items.all())
                items_to_remove = request.data.get('order_items')
                transformed_items = list(map(lambda item: Product.objects.get(id=item),items_to_remove))
                new_cart=[x for x in current_cart if x not in transformed_items]
                cart.order_items.set(new_cart)
                serialized = PopulatedCartSerializer(cart)
                cart_with_total = {**serialized.data,'total':cart.get_total()}
                return Response(cart_with_total, status = status.HTTP_200_OK)
            except Exception as e:
                print(e)
                return Response({'message': 'items not removed'},status=status.HTTP_409_CONFLICT)

    def delete(self,request):
        try:
            cart = Cart.objects.get(user=request.user.id)
        except Cart.DoesNotExist:
            raise NotFound()
        cart.order_items.clear()
        serialized = PopulatedCartSerializer(cart)
        cart_with_total = { **serialized.data, 'total': '0.00' }
        return Response(cart_with_total,status=status.HTTP_202_ACCEPTED)
