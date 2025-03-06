from django.urls import path
from . import views

urlpatterns = [
    path('', views.ValidateCodeView.as_view()),
]