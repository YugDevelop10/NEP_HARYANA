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
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('auth/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
