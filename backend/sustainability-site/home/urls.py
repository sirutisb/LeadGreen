from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    # Basic views
    path('', views.index, name='index'),
    
    # Post related endpoints
    path('posts/', views.PostList.as_view(), name='post-list'),
    path('posts/<int:pk>/', views.PostDetail.as_view(), name='post-detail'),
    path('posts/create/', views.PostCreate.as_view(), name='post-create'),
    path('posts/review/<int:pk>/', views.PostReview.as_view(), name='post-review'),
    
    # User related endpoints
    path('profile/', views.UserProfileDetail.as_view(), name='profile-detail'),
    path('leaderboard/', views.Leaderboard.as_view(), name='leaderboard'),
    
    # Tree related endpoints
    path('tree/water/', views.WaterTree.as_view(), name='water-tree'),
    path('tree/upgrade/', views.UpgradeTree.as_view(), name='upgrade-tree'),
    
    # Shop related endpoints
    path('shop/', views.ShopItemList.as_view(), name='shop-list'),
    path('shop/purchase/<int:pk>/', views.PurchaseItem.as_view(), name='purchase-item'),
    
    # QR Code validation
    path('qr-validate/<str:code>/', views.ValidateQRCode.as_view(), name='validate-qr'),
]

urlpatterns = format_suffix_patterns(urlpatterns)