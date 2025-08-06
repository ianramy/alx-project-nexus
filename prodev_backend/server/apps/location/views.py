# server/apps/location/views.py

from rest_framework import viewsets, permissions
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
)
from .models import Continent, Country, City
from .serializers import ContinentSerializer, CountrySerializer, CitySerializer


class BaseModelViewSet(viewsets.ModelViewSet):
    """
    Base ModelViewSet.
    """
    permission_classes = [permissions.AllowAny]


# -------------------- Continents --------------------

@extend_schema_view(
    list=extend_schema(
        tags=["Locations"],
        summary="List all continents",
        request=None,
        parameters=[],
    ),
    retrieve=extend_schema(
        tags=["Locations"],
        summary="Get a specific continent",
        request=None,
        parameters=[
            OpenApiParameter(
                name="id",
                description="ID of the continent",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
        responses={200: ContinentSerializer},
    ),
    create=extend_schema(
        tags=["Locations"],
        summary="Create a continent",
        request={
            "application/json": ContinentSerializer,
            "application/x-www-form-urlencoded": ContinentSerializer,
        },
        responses={201: ContinentSerializer},
    ),
    update=extend_schema(
        tags=["Locations"],
        summary="Update a continent",
        request={
            "application/json": ContinentSerializer,
            "application/x-www-form-urlencoded": ContinentSerializer,
        },
        responses={200: ContinentSerializer},
    ),
    destroy=extend_schema(
        tags=["Locations"],
        summary="Delete a continent",
        responses={204: None},
    ),
)

class ContinentViewSet(BaseModelViewSet):
    """
    CRUD for continents.
    """
    queryset = Continent.objects.all().order_by("name")
    serializer_class = ContinentSerializer


# -------------------- Countries --------------------

@extend_schema_view(
    list=extend_schema(
        tags=["Locations"],
        summary="List all countries",
        request=None,
        parameters=[]
    ),
    retrieve=extend_schema(
        tags=["Locations"],
        summary="Get a specific country",
        request=None,
        parameters=[
            OpenApiParameter(
                name="id",
                description="ID of the country",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
        responses={200: CountrySerializer},
    ),
    create=extend_schema(
        tags=["Locations"],
        summary="Create a country",
        request={
            "application/json": CountrySerializer,
            "application/x-www-form-urlencoded": CountrySerializer,
        },
        responses={201: CountrySerializer},
    ),
    update=extend_schema(
        tags=["Locations"],
        summary="Update a country",
        request={
            "application/json": CountrySerializer,
            "application/x-www-form-urlencoded": CountrySerializer,
        },
        responses={200: CountrySerializer},
    ),
    destroy=extend_schema(
        tags=["Locations"],
        summary="Delete a country",
        responses={204: None},
    ),
)

class CountryViewSet(BaseModelViewSet):
    """
    CRUD for countries.
    """
    queryset = Country.objects.select_related("continent").all().order_by("name")
    serializer_class = CountrySerializer


# -------------------- Cities --------------------

@extend_schema_view(
    list=extend_schema(
        tags=["Locations"],
        summary="List all cities",
        request=None,
        parameters=[],
    ),
    retrieve=extend_schema(
        tags=["Locations"],
        summary="Get a specific city",
        request=None,
        parameters=[
            OpenApiParameter(
                name="id",
                description="ID of the city",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
        responses={200: CitySerializer},
    ),
    create=extend_schema(
        tags=["Locations"],
        summary="Create a city",
        request={
            "application/json": CitySerializer,
            "application/x-www-form-urlencoded": CitySerializer,
        },
        responses={201: CitySerializer},
    ),
    update=extend_schema(
        tags=["Locations"],
        summary="Update a city",
        request={
            "application/json": CitySerializer,
            "application/x-www-form-urlencoded": CitySerializer,
        },
        responses={200: CitySerializer},
    ),
    destroy=extend_schema(
        tags=["Locations"],
        summary="Delete a city",
        responses={204: None},
    ),
)

class CityViewSet(BaseModelViewSet):
    """
    CRUD for cities.
    """
    queryset = City.objects.select_related("country", "country__continent").all().order_by("name")
    serializer_class = CitySerializer
