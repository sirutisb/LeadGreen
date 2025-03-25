from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model

class UserProfileModelTest(TestCase):
    def setUp(self):
        # get user model to create a testuser
        UserProfile = get_user_model()
        
        #create user
        self.test_user = UserProfile.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )

    def test_user_creation(self):
        # test user was created
        self.assertTrue(isinstance(self.test_user, get_user_model()))
        self.assertEqual(str(self.test_user), 'testuser')