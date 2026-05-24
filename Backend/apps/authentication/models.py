from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class College(models.Model):
    name = models.CharField(max_length=255)
    aishe_code = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, role, password=None, college=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            full_name=full_name,
            role=role,
            college=college,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        role = extra_fields.pop('role', 'admin')
        return self.create_user(
            email=email,
            full_name=full_name,
            role=role,
            password=password,
            **extra_fields
        )

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('principal', 'College Principal'),
        ('admin', 'DHE Admin'),
        ('committee', 'Screening Committee'),
    )
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='principal')
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return f"{self.email} ({self.role})"
