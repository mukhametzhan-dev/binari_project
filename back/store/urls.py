# onlinestore/store/urls.py
from django.urls import path
from .views import (
    RegistrationAPIView,
    LoginAPIView,
    OrderCreateAPIView,
    OrderListAPIView,
    ProductListAPIView,
    UserProfileAPIView,
    ProductDetailAPIView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('orders/', OrderListAPIView.as_view(), name='orders-list'),
    path('profile/', UserProfileAPIView.as_view(), name='profile'),
    path('orders/create/', OrderCreateAPIView.as_view(), name='order-create'),
    path('products/', ProductListAPIView.as_view(), name='products-list'),
    path('products/<int:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),

    
]
