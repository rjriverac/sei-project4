from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser,IsAuthenticatedOrReadOnly
from .permissions import IsOwnerOrReadOnly

from .models import Review
from .serializers import ReviewSerializer

# Create your views here.

class ReviewListView(APIView):
    def get(self,request):
        reviews = Review.objects.all()
        serialized_prods = ReviewSerializer(reviews, many = True)
        return Response(serialized_prods.data, status = status.HTTP_200_OK)
    
    def post(self, request):
        self.permission_classes = (IsAuthenticatedOrReadOnly,)
        request_with_data = {**request.data, 'user': request.user.id}
        review = ReviewSerializer(data = request_with_data)
        if review.is_valid():
            review.save()
            return Response(review.data, status = status.HTTP_201_CREATED)
        else:
            return Response(review.errors, status = status.HTTP_422_UNPROCESSABLE_ENTITY)

class ReviewDetailView(APIView):

    permission_classes=(IsOwnerOrReadOnly,)

    def get(self,request,pk):
        try:
            review = Review.objects.get(id=pk)
            serialized_rev = ReviewSerializer(review)
            return Response(serialized_rev.data, status = status.HTTP_202_ACCEPTED)
        except:
            return Response(status.HTTP_404_NOT_FOUND)

    def delete(self,request,pk):
        try:
            review = Review.objects.get(id=pk)
            if review.user != request.user: raise ValidationError
            review.delete()
        except:
            return Response(status = status.HTTP_403_FORBIDDEN)
        
        return Response(status = status.HTTP_204_NO_CONTENT)

    def put(self,request,pk):
        try:
            review = Review.objects.get(id=pk)
            if review.user != request.user: raise ValidationError()
            updated_rev = ReviewSerializer(review, data = request.data, partial = True)
            if updated_rev.is_valid():
                updated_rev.save()
        except:
            return Response(status = status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            return Response(updated_rev.data, status = status.HTTP_202_ACCEPTED)