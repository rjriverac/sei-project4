from django.urls import path
from .views import CartDetailView, CartListView

urlpatterns = [
    path('',CartListView.as_view()),
    path('view/',CartDetailView.as_view())
]