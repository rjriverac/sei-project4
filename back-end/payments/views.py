from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import stripe
from decouple import config
from cart.models import Cart  
from cart.serializers import PopulatedCartSerializer
import json
from django.http import JsonResponse

# Create your views here.
stripe.api_key = config('STRIPE_SECRET_KEY')

@api_view(['POST'])
def create_payment(request):
    cart = Cart.objects.get(user=request.user)
    total = int(float(cart.get_total()) * 100)
    # print(total)
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


@api_view(['POST'])
def test_payment(request):
    # user_cart = Cart.objects.get(user=request.user)
    # print(user_cart.get_total())
    test_payment_intent = stripe.PaymentIntent.create(
    amount=1000, currency='pln', 
    payment_method_types=['card'],
    receipt_email='test@example.com')
    return Response(status=status.HTTP_200_OK, data=test_payment_intent)

@api_view(['POST'])
def save_stripe_info(request):
    data = request.data
    email = data['email']
    payment_method_id = data['payment_method_id']

    customer_data = stripe.Customer.list(email=email).data
    extra_msg = ''
    # print(customer_data)
    
    if len(customer_data) == 0:
    # creating customer
        customer = stripe.Customer.create(
            email=email, 
            payment_method=payment_method_id,
            invoice_settings={
                'default_payment_method': payment_method_id
            }
        )
    else:
        customer = customer_data[0]
        extra_msg = "Customer already existed"

    stripe.PaymentIntent.create(
        customer=customer,
        payment_method = payment_method_id,
        currency='pln',
        amount=1500,
        confirm=True
    )

    return Response(status=status.HTTP_200_OK,data={ 'message': 'Success', 'data': {'customer_id':customer.id, 'extra_msg':extra_msg}})                        

@api_view(['POST'])
def confirm_payment_intent(request):
    data = request.data
    payment_intent_id = data['payment_intent_id']

    stripe.PaymentIntent.confirm(payment_intent_id)

    return Response(status=status.HTTP_200_OK, data={"message": "Success"})