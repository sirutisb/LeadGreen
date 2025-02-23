from django.urls import path
from . import views

urlpatterns = [
    path('', views.GameProfileView.as_view()),
    path('tree/water/', views.WaterTreeAction.as_view()),
    path('tree/soil/', views.SoilTreeAction.as_view()),
    path('tree/glove/', views.GloveTreeAction.as_view()),
    path('spin/', views.SpinView.as_view()),
]