from django.urls import path
from . import views

urlpatterns = [
    path('tree/water', views.WaterTreeAction),
    path('tree/soil', views.SoilTreeAction),
    path('tree/glove', views.GloveTreeAction),
    
]