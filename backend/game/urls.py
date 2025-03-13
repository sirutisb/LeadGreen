from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'inventory', views.InventoryViewSet, basename='inventory')

urlpatterns = [
    path('', views.GameProfileView.as_view()), # Game Profile Get Request URL (at root)
    path('tree/water/', views.WaterTreeAction.as_view()),
    path('tree/soil/', views.SoilTreeAction.as_view()),
    path('tree/glove/', views.GloveTreeAction.as_view()),
    path('spin/', views.SpinView.as_view()),
    path('spin/prizes/', views.GetPrizes.as_view()),
    path('', include(router.urls)),
]