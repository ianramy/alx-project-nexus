# server/apps/users/urls.py

from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from .profile_views import get_me, get_user_leaderboard, get_user_challenges, get_user_actions
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r"", UserViewSet)

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", get_me, name="me"),
    path("me/leaderboard/", get_user_leaderboard, name="user-leaderboard"),
    path("me/challenges/", get_user_challenges, name="user-challenges"),
    path("me/actions/", get_user_actions, name="user-actions"),
    path("", include(router.urls)),
]
