from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

#from django.conf import settings
#from django.conf.urls.static import static

urlpatterns = [
    path('', views.getRoutes),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('posts/', views.PostView.as_view(), name='posts'),

    path('user/<int:pk>/', views.getUserProfile, name='user-profile'),
]
# TODO: add this later: + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)