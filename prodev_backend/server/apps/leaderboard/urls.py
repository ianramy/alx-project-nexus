# server/apps/leaderboard/urls.py

from rest_framework.routers import DefaultRouter
from .views import LeaderboardViewSet
from django.urls import path, include


router = DefaultRouter()
router.register(r"", LeaderboardViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
