from django.contrib.auth.models import User
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