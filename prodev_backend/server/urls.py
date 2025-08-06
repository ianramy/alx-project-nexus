# server/urls.py

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from server.apps.users.auth_views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CustomTokenVerifyView,
    CustomTokenBlacklistView,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", SpectacularSwaggerView.as_view(url_name="schema")),
    path("api/users/", include("server.apps.users.urls")),
    path("api/actions/", include("server.apps.actions.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/challenges/", include("server.apps.challenges.urls")),
    path("api/leaderboard/", include("server.apps.leaderboard.urls")),
    path("api/location/", include("server.apps.location.urls")),
    path("api/notifications/", include("server.apps.notifications.urls")),
    path(
        "api/auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"
    ),
    path(
        "api/auth/token-refresh/",
        CustomTokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path(
        "api/auth/token-verify/", CustomTokenVerifyView.as_view(), name="token_verify"
    ),
    path(
        "api/auth/logout/", CustomTokenBlacklistView.as_view(), name="token_blacklist"
    ),
]
