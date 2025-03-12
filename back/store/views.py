# onlinestore/store/views.py
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework import serializers
from .serializers import (
    RegistrationSerializer,
    LoginSerializer,
    OrderSerializer,
    ProductSerializer,
    UserSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Order, Product

# Registration API
class RegistrationAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    print(queryset)
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]

# Login API
class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        print(username)
        print(password)
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            print(refresh)
            print(refresh.access_token)
            print("AUTHENTICATED")
            
            access_token = refresh.access_token
            print(access_token.payload['exp'])
            return Response({
                'refresh': str(refresh),
                'access': str(access_token),
                'access_token_expires': access_token.payload['exp']
            
            }, status=status.HTTP_200_OK)
        
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Create a new order
class OrderCreateAPIView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

# List orders for the logged-in user
class OrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
class UserProfileSerializer(serializers.ModelSerializer):
    orders = OrderSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'orders']

class UserProfileAPIView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id).prefetch_related('order_set')
# List products available
class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Product.objects.all()
# onlinestore/store/views.py


#Specific product
class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Product.objects.all()

# onlinestore/store/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib import messages

def login_view(request):
    if request.method == "POST":
        # Process login using your backend logic or REST API
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, "Invalid credentials.")
    return render(request, "login.html")

def registration_view(request):
    if request.method == "POST":
        # Process registration using your backend logic
        # Validate and create a new user
        # For simplicity, using Django's built-in User model here

        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        password2 = request.POST.get("password2")
        if password != password2:
            messages.error(request, "Passwords do not match.")
            return redirect('register')
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            messages.success(request, "Registration successful. Please log in.")
            return redirect('login')
        except Exception as e:
            messages.error(request, f"Error: {str(e)}")
            return redirect('register')
    return render(request, "registration.html")

def profile_view(request):
    return render(request, "profile.html")

def order_create_view(request):
    if request.method == "POST":
        # Here you would process the order data, call your REST API endpoint, etc.
        messages.success(request, "Order placed successfully!")
        return redirect('profile')
    return render(request, "order_form.html")
