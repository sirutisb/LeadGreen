from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

## ALL urls for now will clean up

urlpatterns = [
    path('', views.getRoutes),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('posts/', views.PostView.as_view(), name='posts'),

    path('user/<int:pk>/', views.getUserProfile, name='user-profile'),
]