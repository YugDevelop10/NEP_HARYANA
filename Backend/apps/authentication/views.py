from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .models import College, User
from .serializers import CollegeSerializer, UserSerializer, RegisterSerializer, LoginSerializer

class CollegeListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        colleges = College.objects.all()
        serializer = CollegeSerializer(colleges, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            return Response({
                'token': token.key,
                'user': user_data,
                'message': 'Account created successfully.'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=email, password=password)
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                user_data = UserSerializer(user).data
                return Response({
                    'token': token.key,
                    'user': user_data,
                    'message': 'Signed in successfully.'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'detail': 'Invalid email or password.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'If an account exists for that email address, a reset link has been sent.'
        }, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')
        confirm_password = request.data.get('confirmPassword')
        
        if not all([uid, token, password, confirm_password]):
            return Response({'detail': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if password != confirm_password:
            return Response({'detail': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({
            'message': 'Password updated successfully.'
        }, status=status.HTTP_200_OK)
