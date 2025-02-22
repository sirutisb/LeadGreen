from django.urls import path
from . import views

urlpatterns = [
    path('tree/water/', views.WaterTreeAction.as_view()),
    path('tree/soil/', views.SoilTreeAction.as_view()),
    path('tree/glove/', views.GloveTreeAction.as_view()),
]