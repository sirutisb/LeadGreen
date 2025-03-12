from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListCreate.as_view(), name='post-list-create'),
    path('<int:post_id>/like/', views.ToggleLikePost.as_view(), name = 'like-post'),
]