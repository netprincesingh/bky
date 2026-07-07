from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, AdminLoginView



urlpatterns = [

    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),



    
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]