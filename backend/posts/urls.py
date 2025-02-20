from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

## ALL urls for now will clean up

urlpatterns = [
    path('', views.PostView.as_view(), name='posts'),
]