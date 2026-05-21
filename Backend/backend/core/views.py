import logging

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from smtplib import SMTPException
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import College, CollegeProfile
from .serializers import (
	CollegeLoginSerializer,
	CollegeProfileSerializer,
	CollegeRegistrationSerializer,
	CollegeSerializer,
	PasswordResetConfirmSerializer,
	PasswordResetRequestSerializer,
)


logger = logging.getLogger(__name__)


class CollegeListView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		colleges = College.objects.filter(is_active=True).order_by('name')
		return Response(CollegeSerializer(colleges, many=True).data)


class RegisterView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = CollegeRegistrationSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		token, _ = Token.objects.get_or_create(user=user)
		return Response(
			{
				'message': 'Institution account created successfully.',
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


class PasswordResetRequestView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = PasswordResetRequestSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.get_user()

		if user:
			uid = urlsafe_base64_encode(force_bytes(user.pk))
			token = default_token_generator.make_token(user)
			reset_path = settings.PASSWORD_RESET_PATH.format(uid=uid, token=token)
			reset_url = f"{settings.FRONTEND_URL.rstrip('/')}{reset_path}"
			subject = 'Reset your NEP Haryana portal password'
			context = {
				'user': user,
				'full_name': user.first_name or user.get_username(),
				'reset_url': reset_url,
				'support_email': settings.DEFAULT_FROM_EMAIL,
			}
			text_body = render_to_string('email/password_reset_email.txt', context)
			html_body = render_to_string('email/password_reset_email.html', context)
			message = EmailMultiAlternatives(
				subject=subject,
				body=text_body,
				from_email=settings.DEFAULT_FROM_EMAIL,
				to=[user.email],
			)
			message.attach_alternative(html_body, 'text/html')
			try:
				message.send(fail_silently=False)
			except (SMTPException, OSError) as exc:
				logger.exception('Password reset email failed for user_id=%s: %s', user.pk, exc)

		return Response(
			{
				'message': 'If an account exists for that email address, a reset link has been sent.',
			},
			status=status.HTTP_200_OK,
		)


class PasswordResetConfirmView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = PasswordResetConfirmSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.validated_data['user']
		user.set_password(serializer.validated_data['password'])
		user.save(update_fields=['password'])
		Token.objects.filter(user=user).delete()

		return Response(
			{
				'message': 'Password updated successfully. Please sign in with your new password.',
			},
			status=status.HTTP_200_OK,
		)
