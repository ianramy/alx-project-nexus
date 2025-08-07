# server/apps/notifications/views.py

from rest_framework import viewsets, permissions
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from .models import Notification
from .serializers import NotificationSerializer, NotificationCreateSerializer
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter
)


@extend_schema_view(
    list=extend_schema(
        tags=["Notifications"],
        summary="Get all the notifcations",
        request=None,
        parameters=[],
    ),
    retrieve=extend_schema(
        tags=["Notifications"],
        summary="Get a specific notifcation",
        request=None,
        parameters=[
            OpenApiParameter(
                name="id",
                description="ID of the notification",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
    ),
    create=extend_schema(
        tags=["Notifications"],
        summary="Create a notifcation",
        request={"application/json": NotificationCreateSerializer},
        responses={201: NotificationSerializer},
    ),
    update=extend_schema(
        tags=["Notifications"],
        summary="Update a notifcation",
        request={"application/json": NotificationCreateSerializer},
        responses={200: NotificationSerializer},
    ),
    destroy=extend_schema(
        tags=["Notifications"],
        summary="Delete a notifcation",
        responses={204: None},
    ),
)


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return NotificationCreateSerializer
        return NotificationSerializer

