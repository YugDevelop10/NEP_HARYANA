from django.contrib import admin

from .models import College, CollegeProfile


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
	list_display = ('name', 'aishe_code', 'is_active', 'created_at')
	search_fields = ('name', 'aishe_code')


@admin.register(CollegeProfile)
class CollegeProfileAdmin(admin.ModelAdmin):
	list_display = ('full_name', 'college_name', 'aishe_code', 'role', 'city', 'state', 'user')
	search_fields = ('full_name', 'college_name', 'aishe_code', 'city', 'state', 'user__email')
