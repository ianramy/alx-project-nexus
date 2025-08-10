# server/apps/actions/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from .models import EcoAction, ActionTemplate
from .serializers import (
    EcoActionSerializer,
    EcoActionCreateSerializer,
    ActionTemplateSerializer,
)
from .permissions import IsOwnerOrAdmin
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from rest_framework.response import Response


@extend_schema_view(
    list=extend_schema(
        tags=["Actions"],
        summary="Get my actions",
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
            )
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
        tags=["Actions"], summary="Delete an action", responses={204: None}
    ),
)


class EcoActionViewSet(viewsets.ModelViewSet):
    queryset = EcoAction.objects.select_related("user", "challenge").all()
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_permissions(self):
        if self.action in ["list", "retrieve", "create"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]

    def get_serializer_class(self):
        return (
            EcoActionCreateSerializer
            if self.action in ["create", "update", "partial_update"]
            else EcoActionSerializer
        )

    def get_queryset(self):
        qs = super().get_queryset()
        # Non-staff users only see their own actions
        if not self.request.user.is_staff:
            qs = qs.filter(user_id=self.request.user.id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        create_serializer = self.get_serializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)
        self.perform_create(create_serializer)
        full = EcoActionSerializer(
            create_serializer.instance, context=self.get_serializer_context()
        )
        return Response(full.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        update_serializer = self.get_serializer(
            instance, data=request.data, partial=kwargs.get("partial", False)
        )
        update_serializer.is_valid(raise_exception=True)
        self.perform_update(update_serializer)
        full = EcoActionSerializer(
            update_serializer.instance, context=self.get_serializer_context()
        )
        return Response(full.data)

class ActionTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public catalog: list + retrieve.
    """

    queryset = ActionTemplate.objects.select_related("challenge").all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ActionTemplateSerializer
