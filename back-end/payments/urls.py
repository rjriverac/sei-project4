from django.conf.urls import url
from payments import views

urlpatterns = [
    url(r'^create-payment-intent/$', views.create_payment)
]