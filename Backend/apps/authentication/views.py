from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.core.cache import cache
from django.utils import timezone
import datetime

from .models import College, User, RefreshToken
from .serializers import CollegeSerializer, UserSerializer, RegisterSerializer, LoginSerializer
from .utils import generate_auth_tokens, rotate_refresh_token_header

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
            user_data = UserSerializer(user).data
            tokens = generate_auth_tokens(user)
            return Response({
                'user': user_data,
                'tokens': tokens,
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
            
            # Brute-force protection / Account Lockout check
            lockout_key = f"lockout_{email}"
            attempts_key = f"attempts_{email}"
            
            lockout_time = cache.get(lockout_key)
            if lockout_time:
                # Handle timezone-aware conversion or native timezone
                now = timezone.now()
                if lockout_time > now:
                    time_left = int((lockout_time - now).total_seconds())
                    return Response({
                        'detail': f'Too many failed login attempts. Locked out. Try again in {time_left} seconds.'
                    }, status=status.HTTP_429_TOO_MANY_REQUESTS)
            
            user = authenticate(request, username=email, password=password)
            if user is not None:
                # Success: reset login attempt counts
                cache.delete(attempts_key)
                cache.delete(lockout_key)
                
                user_data = UserSerializer(user).data
                tokens = generate_auth_tokens(user)
                return Response({
                    'user': user_data,
                    'tokens': tokens,
                    'message': 'Signed in successfully.'
                }, status=status.HTTP_200_OK)
            else:
                # Failure: increment login attempts count
                attempts = cache.get(attempts_key, 0) + 1
                if attempts >= 5:
                    cache.set(lockout_key, timezone.now() + datetime.timedelta(minutes=15), 15 * 60)
                    cache.delete(attempts_key)
                    return Response({
                        'detail': 'Account locked due to too many failed login attempts. Locked for 15 minutes.'
                    }, status=status.HTTP_429_TOO_MANY_REQUESTS)
                else:
                    cache.set(attempts_key, attempts, 15 * 60)
                
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
        
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from django.contrib.auth.tokens import default_token_generator
        from django.template.loader import render_to_string
        from django.core.mail import EmailMultiAlternatives
        from django.conf import settings
        import logging

        logger = logging.getLogger(__name__)

        user = User.objects.filter(email__iexact=email).first()
        reset_url = None

        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173').rstrip('/')
            reset_url = f"{frontend_url}/auth/reset-password/{uid}/{token}"

            # Render HTML and text templates
            context = {
                'user': user,
                'reset_url': reset_url,
            }
            html_content = render_to_string('authentication/password_reset_email.html', context)
            text_content = render_to_string('authentication/password_reset_email.txt', context)

            subject = "Reset Your Password - HSHEC NEP Portal"
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@haryana.gov.in')
            
            try:
                msg = EmailMultiAlternatives(
                    subject=subject,
                    body=text_content,
                    from_email=from_email,
                    to=[user.email]
                )
                msg.attach_alternative(html_content, "text/html")
                msg.send()
            except Exception as e:
                logger.error(f"Failed to send password reset email to {user.email}: {str(e)}")
                # If in DEBUG mode, return the reset URL to client for easier development testing
                if settings.DEBUG:
                    return Response({
                        'message': 'If an account exists for that email address, a reset link has been sent.',
                        'debug_reset_url': reset_url,
                        'debug_error': f"Mail delivery failed: {str(e)}"
                    }, status=status.HTTP_200_OK)
        
        # Always return generic success message for security/privacy reasons
        if settings.DEBUG and not user:
            return Response({
                'message': 'If an account exists for that email address, a reset link has been sent.',
                'debug_message': f"No user found with email {email}"
            }, status=status.HTTP_200_OK)

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
            
        from django.utils.http import urlsafe_base64_decode
        from django.utils.encoding import force_str
        from django.contrib.auth.tokens import default_token_generator
        from django.contrib.auth.password_validation import validate_password
        from django.core.exceptions import ValidationError
        
        try:
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            user = User.objects.filter(pk=uid_decoded).first()
        except (TypeError, ValueError, OverflowError):
            user = None
            
        if user is not None and default_token_generator.check_token(user, token):
            try:
                validate_password(password, user)
            except ValidationError as e:
                return Response({'detail': e.messages[0]}, status=status.HTTP_400_BAD_REQUEST)
                
            user.set_password(password)
            user.save()
            
            # Clear all existing tokens for this user so they have to login again
            from rest_framework.authtoken.models import Token
            Token.objects.filter(user=user).delete()
            # Invalidate all active refresh tokens
            RefreshToken.objects.filter(user=user).update(is_revoked=True)
            
            return Response({
                'message': 'Password updated successfully.'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'detail': 'The reset link is invalid or has expired.'
            }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            from .utils import hash_token
            hashed = hash_token(refresh_token)
            RefreshToken.objects.filter(token=hashed).update(is_revoked=True)
            
        return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({'detail': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
            
        tokens = rotate_refresh_token_header(refresh_token)
        if not tokens:
            return Response({'detail': 'Invalid, expired, or reused refresh token.'}, status=status.HTTP_410_GONE)
            
        return Response({
            'tokens': tokens,
            'message': 'Token refreshed successfully.'
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

