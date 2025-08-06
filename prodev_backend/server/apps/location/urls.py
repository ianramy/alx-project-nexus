# server/apps/location/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContinentViewSet, CountryViewSet, CityViewSet


app_name = "location"

router = DefaultRouter()
router.register(r"continents", ContinentViewSet, basename="continent")
router.register(r"countries", CountryViewSet, basename="country")
router.register(r"cities", CityViewSet, basename="city")

urlpatterns = [
    path("", include(router.urls)),
]
