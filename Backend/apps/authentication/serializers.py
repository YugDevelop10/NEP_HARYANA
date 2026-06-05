from rest_framework import serializers
from .models import User, College

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name', 'aishe_code']

class UserSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name', read_only=True)
    collegeId = serializers.SerializerMethodField()
    college_id = serializers.SerializerMethodField()
    college_name = serializers.SerializerMethodField()
    aishe_code = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'fullName', 'role', 'collegeId', 'college_id', 'college_name', 'aishe_code']

    def get_collegeId(self, obj):
        return obj.college.id if obj.college else None

    def get_college_id(self, obj):
        return obj.college.id if obj.college else None

    def get_college_name(self, obj):
        if obj.college:
            return obj.college.name
        if obj.role == 'admin':
            return "Higher Education Department"
        if obj.role == 'committee':
            return "Screening Committee"
        return "Govt College Example"

    def get_aishe_code(self, obj):
        if obj.college:
            return obj.college.aishe_code
        if obj.role == 'admin':
            return "DHE-HR"
        if obj.role == 'committee':
            return "SC-HR"
        return "C-12345"

class RegisterSerializer(serializers.Serializer):
    fullName = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    collegeId = serializers.IntegerField(required=False, allow_null=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_collegeId(self, value):
        if value is not None:
            if not College.objects.filter(id=value).exists():
                raise serializers.ValidationError("Selected institution does not exist.")
        return value

    def validate(self, attrs):
        role = attrs.get('role')
        college_id = attrs.get('collegeId')
        if role == 'principal' and college_id is None:
            raise serializers.ValidationError({"collegeId": "Institution is required for College Principal role."})
        return attrs

    def create(self, validated_data):
        role = validated_data['role']
        college_id = validated_data.get('collegeId')
        college = None
        if role == 'principal' and college_id is not None:
            college = College.objects.get(id=college_id)
        elif college_id is not None:
            college = College.objects.filter(id=college_id).first()

        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['fullName'],
            role=role,
            password=validated_data['password'],
            college=college
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
