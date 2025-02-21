from django.test import TestCase
from users.models import UserProfile
from qrcodes.models import QRCode
from posts.models import Post
from datetime import datetime

from django.core.files.uploadedfile import SimpleUploadedFile

# Create your tests here.

class PostModelTest(TestCase):
    # set up post test 
    def setUp(self):
        self.user = UserProfile.objects.create(username="test")
        self.image = SimpleUploadedFile("test.jpg", b"content", content_type="image/jpg")

        self.post = Post.objects.create(
            user=self.user,
            image = self.image,
            caption = "caption",
            private = True,
            qr_code = "qrcodeteststring",
            approved = True,
            points_received = 1

        )

    # check the creation of the post worked

    def test_post_create(self):
        self.assertEqual(self.post.user.username, "test")
        self.assertTrue(self.post.image)
        self.assertEqual(self.post.caption, "caption")
        self.assertTrue(self.post.private)
        self.assertEqual(self.post.qr_code, "qrcodeteststring")
        self.assertTrue(self.post.approved)
        self.assertEqual(self.post.points_received, 1)

    # check the tostring method 

    def test_post_str(self):
         self.assertEqual(str(self.post), "test - caption | Points: 1")

    # create another post and test they are added in the correct order
    def test_post_order(self):
        post2 = Post.objects.create(
            user = self.user,
            image = self.image,
            caption = "post test 2",
            private = False,
            qr_code = "abcdef1234567890",
            approved = False,
            points_received = 5
        )

        posts = list(Post.objects.all())
        self.assertEqual(posts[0], post2)
        self.assertEqual(posts[1], self.post)
