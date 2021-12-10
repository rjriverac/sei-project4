from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import stripe
from decouple import config
from cart.models import Cart  


# Create your views here.
stripe.api_key = config('STRIPE_SECRET_KEY')

@api_view(['POST'])
def create_payment(request):
    cart = Cart.objects.get(user=request.user)
    total = int(float(cart.get_total()) * 100)
    try:
        intent = stripe.PaymentIntent.create(
            amount = total,
            currency = 'usd',
            automatic_payment_methods = {
                'enabled': True,
            },
        )
        # print(intent)
        return Response({ 'clientsecret': intent['client_secret']})
    except Exception as e:
        return Response(str(e),status=status.HTTP_403_FORBIDDEN)
