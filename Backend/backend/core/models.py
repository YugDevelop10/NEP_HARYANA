from django.contrib.auth.models import User
from django.db import models


class College(models.Model):
	name = models.CharField(max_length=255, unique=True)
	aishe_code = models.CharField(max_length=30, unique=True)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.name


class CollegeProfile(models.Model):
	class Role(models.TextChoices):
		PRINCIPAL = 'principal', 'College Principal'
		ADMIN = 'admin', 'DHE Admin'
		COMMITTEE = 'committee', 'Screening Committee'

	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='college_profile')
	college = models.ForeignKey(College, on_delete=models.PROTECT, related_name='profiles', null=True, blank=True)
	full_name = models.CharField(max_length=255)
	college_name = models.CharField(max_length=255)
	aishe_code = models.CharField(max_length=30)
	role = models.CharField(max_length=20, choices=Role.choices, default=Role.PRINCIPAL)
	address = models.CharField(max_length=255)
	city = models.CharField(max_length=120)
	pin = models.CharField(max_length=12)
	state = models.CharField(max_length=120)
	website = models.URLField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.college_name
