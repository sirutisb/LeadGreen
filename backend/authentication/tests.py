from django.test import TestCase

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

# Create your tests here.

UserProfile = get_user_model()

class AuthenticationTest(APITestCase):
    """
    
    """

    def setUp(self):
        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/login/"
        self.user_data = {
            "username": "test",
            "email": "test@mail.com",
            "password": "password",
        }
        self.user = UserProfile.objects.create_user(**self.user_data)

    def test_register_success(self):
        response = self.client.post(self.register_url, {
            "username": "newuser",
            "email": "newuser@mail.com",
            "password": "password"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tokens", response.data)
        self.assertIn("user", response.data)

    def test_register_failure(self):
        response = self.client.post(self.register_url, {
            "username": "",
            "email": "bad-email",
            "password": "p"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("errors", response.data)

    def test_login_success(self):
        response = self.client.post(self.login_url, {
            "username": self.user_data["username"],
            "password": self.user_data["password"]
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)
        self.assertIn("user", response.data)

    def test_login_failure(self):
        response = self.client.post(self.login_url, {
            "username": self.user_data["username"],
            "password": "incorrect"
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("errors", response.data)