from django.urls import path
from .views import (
    list_treeLevel,
    list_lifetimePoints,
    list_pointsBalance,
)

urlpatterns = [
    path('points/', list_pointsBalance.as_view(), name='top-points-balance'),
    path('tree-level/', list_treeLevel.as_view(), name='tree-level-list'),
    path('lifetime-points/', list_lifetimePoints.as_view(), name='lifetime-points-list'),

]