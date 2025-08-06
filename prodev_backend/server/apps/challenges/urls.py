# server/apps/challenges/urls.py

from rest_framework.routers import DefaultRouter
from .views import ChallengeViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r"", ChallengeViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
