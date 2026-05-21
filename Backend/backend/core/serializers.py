from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers

from .models import College, CollegeProfile


class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name', 'aishe_code']


class CollegeProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    college_id = serializers.SerializerMethodField()

    def get_college_id(self, obj):
        return obj.college_id

    class Meta:
        model = CollegeProfile
        fields = [
            'college_id',
            'full_name',
            'college_name',
            'aishe_code',
            'role',
            'address',
            'city',
            'pin',
            'state',
            'website',
            'email',
        ]


class CollegeRegistrationSerializer(serializers.Serializer):
    collegeId = serializers.PrimaryKeyRelatedField(source='college', queryset=College.objects.filter(is_active=True))
    fullName = serializers.CharField(max_length=255)
    role = serializers.ChoiceField(choices=CollegeProfile.Role.choices)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_email(self, value):
        normalized_email = User.objects.normalize_email(value).lower()
        if User.objects.filter(email__iexact=normalized_email).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return normalized_email

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        full_name = validated_data.pop('fullName').strip()
        college = validated_data.pop('college')
        role = validated_data.pop('role')
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=full_name,
        )
        CollegeProfile.objects.create(
            user=user,
            college=college,
            full_name=full_name,
            college_name=college.name,
            aishe_code=college.aishe_code,
            role=role,
            **validated_data,
        )
        return user


class CollegeLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        return User.objects.normalize_email(value).lower()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return User.objects.normalize_email(value).lower()

    def get_user(self):
        email = self.validated_data['email']
        return User.objects.filter(email__iexact=email).first()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)
    confirmPassword = serializers.CharField(min_length=8, write_only=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['confirmPassword']:
            raise serializers.ValidationError({'confirmPassword': 'Passwords do not match.'})

        user = self._get_user(attrs['uid'])
        if user is None:
            raise serializers.ValidationError({'uid': 'Invalid or expired password reset link.'})

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({'token': 'Invalid or expired password reset link.'})

        attrs['user'] = user
        return attrs

    def _get_user(self, uid):
        user_model = get_user_model()

        try:
            decoded_uid = force_str(urlsafe_base64_decode(uid))
            return user_model.objects.get(pk=decoded_uid)
        except (TypeError, ValueError, OverflowError, user_model.DoesNotExist):
            return None