from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CollegeProfile
from .serializers import CollegeLoginSerializer, CollegeProfileSerializer, CollegeRegistrationSerializer


class RegisterView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = CollegeRegistrationSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		token, _ = Token.objects.get_or_create(user=user)
		return Response(
			{
				'message': 'College account created successfully.',
				'token': token.key,
				'user': CollegeProfileSerializer(user.college_profile).data,
			},
			status=status.HTTP_201_CREATED,
		)


class LoginView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = CollegeLoginSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		email = serializer.validated_data['email']
		password = serializer.validated_data['password']
		user = authenticate(request=request, username=email, password=password)
		if user is None:
			raise AuthenticationFailed('Invalid email or password.')

		token, _ = Token.objects.get_or_create(user=user)
		return Response(
			{
				'message': 'Login successful.',
				'token': token.key,
				'user': CollegeProfileSerializer(user.college_profile).data,
			},
			status=status.HTTP_200_OK,
		)


class MeView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		profile = CollegeProfile.objects.filter(user=request.user).first()
		return Response(
			{
				'email': request.user.email,
				'username': request.user.username,
				'profile': CollegeProfileSerializer(profile).data if profile else None,
			}
		)
