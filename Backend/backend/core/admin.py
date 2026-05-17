from django.contrib import admin

from .models import CollegeProfile


@admin.register(CollegeProfile)
class CollegeProfileAdmin(admin.ModelAdmin):
	list_display = ('college_name', 'city', 'state', 'user')
	search_fields = ('college_name', 'city', 'state', 'user__email')
