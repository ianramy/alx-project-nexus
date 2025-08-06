# server/apps/notifications/urls.py

from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet
from django.urls import path, include


router = DefaultRouter()
router.register(r"", NotificationViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
