# server/apps/actions/urls.py

from rest_framework.routers import DefaultRouter
from .views import EcoActionViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r"", EcoActionViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
