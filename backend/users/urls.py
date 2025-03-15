from django.urls import path
from . import views

urlpatterns = [
    path('<int:pk>/', views.UserProfileView.as_view(), name='user-profile'),
    path('<int:id>/posts', views.UserPostsView.as_view(), name='user-posts'),
]