# server/apps/actions/views.py

from rest_framework import viewsets, permissions
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from .models import EcoAction
from .serializers import EcoActionSerializer, EcoActionCreateSerializer
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
        request={"application/x-www-form-urlencoded": EcoActionCreateSerializer},
        responses={201: EcoActionSerializer},
    ),
    update=extend_schema(
        tags=["Actions"],
        summary="Update an action",
        request={"application/x-www-form-urlencoded": EcoActionCreateSerializer},
        responses={200: EcoActionSerializer},
    ),
    destroy=extend_schema(
        tags=["Actions"],
        summary="Delete an action",
        responses={204: None},
    ),
)


class EcoActionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = EcoAction.objects.all()
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return EcoActionCreateSerializer
        return EcoActionSerializer
