from django.urls import path
from .views import UserProfileView, UserPostsView, UpdateProfilePictureView

urlpatterns = [
    path('<int:pk>/', UserProfileView.as_view(), name='user-profile'),
    path('<int:id>/posts/', UserPostsView.as_view(), name='user-posts'),
    path('picture/', UpdateProfilePictureView.as_view(), name='update-profile-picture'),
]