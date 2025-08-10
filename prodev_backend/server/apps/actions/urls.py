# server/apps/actions/urls.py

from rest_framework.routers import DefaultRouter
from .views import EcoActionViewSet, ActionTemplateViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r"eco-actions", EcoActionViewSet, basename="eco-action")
router.register(r"action-templates", ActionTemplateViewSet, basename="action-template")

urlpatterns = [
    path("", include(router.urls)),
]
