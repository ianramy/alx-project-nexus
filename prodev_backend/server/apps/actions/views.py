# server/apps/actions/views.py

from rest_framework import viewsets, permissions
from .models import EcoAction
from .serializers import EcoActionSerializer
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter
)


@extend_schema_view(
    list=extend_schema(
        tags=["Actions"],
        summary="Get all the actions",
        request=None,
        parameters=[],
    ),
    retrieve=extend_schema(
        tags=["Actions"],
        summary="Get a specific action",
        request=None,
        parameters=[
            OpenApiParameter(
                name="id",
                description="ID of the action",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
    ),
    create=extend_schema(
        tags=["Actions"],
        summary="Create an action",
        request={"application/x-www-form-urlencoded": EcoActionSerializer},
        responses={201: EcoActionSerializer},
    ),
    update=extend_schema(
        tags=["Actions"],
        summary="Update an action",
        request={"application/x-www-form-urlencoded": EcoActionSerializer},
        responses={200: EcoActionSerializer},
    ),
    destroy=extend_schema(
        tags=["Actions"],
        summary="Delete an action",
        responses={204: None},
    ),
)


class EcoActionViewSet(viewsets.ModelViewSet):
    serializer_class = EcoActionSerializer
    permission_classes = [permissions.AllowAny]
    queryset = EcoAction.objects.all()