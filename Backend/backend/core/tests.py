from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APIClient

User = get_user_model()


class PasswordResetFlowTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.user = User.objects.create_user(
			username='principal@example.com',
			email='principal@example.com',
			password='OldPassword123',
			first_name='Principal User',
		)

	@override_settings(
		EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
		FRONTEND_URL='http://frontend.local',
		PASSWORD_RESET_PATH='/reset-password/{uid}/{token}',
		DEFAULT_FROM_EMAIL='no-reply@example.com',
	)
	def test_password_reset_request_sends_email(self):
		response = self.client.post(
			reverse('auth-password-reset'),
			{'email': self.user.email},
			format='json',
		)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(mail.outbox), 1)
		self.assertIn('http://frontend.local/reset-password/', mail.outbox[0].body)
		self.assertEqual(mail.outbox[0].to, [self.user.email])

	@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
	def test_password_reset_confirm_updates_password(self):
		uid = urlsafe_base64_encode(force_bytes(self.user.pk))
		token = default_token_generator.make_token(self.user)

		response = self.client.post(
			reverse('auth-password-reset-confirm'),
			{
				'uid': uid,
				'token': token,
				'password': 'NewPassword123',
				'confirmPassword': 'NewPassword123',
			},
			format='json',
		)

		self.assertEqual(response.status_code, 200)
		self.user.refresh_from_db()
		self.assertTrue(self.user.check_password('NewPassword123'))
