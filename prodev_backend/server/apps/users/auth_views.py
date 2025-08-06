# server/apps/users/auth_views.py

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)
from drf_spectacular.utils import extend_schema


@extend_schema(tags=["Auth"], summary="Login - Get access & refresh tokens")
class CustomTokenObtainPairView(TokenObtainPairView):
    pass


@extend_schema(tags=["Auth"], summary="Refresh access token using refresh token")
class CustomTokenRefreshView(TokenRefreshView):
    pass


@extend_schema(tags=["Auth"], summary="Verify if access or refresh token is valid")
class CustomTokenVerifyView(TokenVerifyView):
    pass


@extend_schema(tags=["Auth"], summary="Logout - Blacklist refresh token")
class CustomTokenBlacklistView(TokenBlacklistView):
    pass
