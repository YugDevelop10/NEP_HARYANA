from django.urls import path
from .views import (
    CollegeListView,
    RegisterView,
    LoginView,
    PasswordResetRequestView,
    PasswordResetConfirmView
)

urlpatterns = [
    path('colleges/', CollegeListView.as_view(), name='college-list'),
    path('auth/signup/', RegisterView.as_view(), name='signup'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/forgot-password/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('auth/reset-password/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
