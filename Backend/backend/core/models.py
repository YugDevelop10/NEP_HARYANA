from django.contrib.auth.models import User
from django.db import models


class CollegeProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='college_profile')
	college_name = models.CharField(max_length=255)
	address = models.CharField(max_length=255)
	city = models.CharField(max_length=120)
	pin = models.CharField(max_length=12)
	state = models.CharField(max_length=120)
	website = models.URLField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.college_name
