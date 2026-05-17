from django.contrib.auth.models import User
from rest_framework import serializers

from .models import CollegeProfile


class CollegeProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = CollegeProfile
        fields = [
            'college_name',
            'address',
            'city',
            'pin',
            'state',
            'website',
            'email',
        ]


class CollegeRegistrationSerializer(serializers.Serializer):
    collegeName = serializers.CharField(max_length=255)
    address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=120)
    pin = serializers.CharField(max_length=12)
    state = serializers.CharField(max_length=120)
    website = serializers.URLField(required=False, allow_blank=True)
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
        college_name = validated_data.pop('collegeName')
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=college_name,
        )
        CollegeProfile.objects.create(
            user=user,
            college_name=college_name,
            **validated_data,
        )
        return user


class CollegeLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        return User.objects.normalize_email(value).lower()