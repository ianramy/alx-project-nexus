# server/apps/users/views.py

from rest_framework import viewsets, permissions
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from .models import CustomUser
from .serializers import UserSerializer, UserCreateSerializer
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter
)


@extend_schema_view(
    list=extend_schema(
        tags=["Users"],
        summary="Get all the users",
        request=None,
        parameters=[],
    ),
    retrieve=extend_schema(
        tags=["Users"],
        summary="Get a specific user",
        request=None,
        parameters=[
            OpenApiParameter(
                name="id",
                description="ID of the user",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
    ),
    create=extend_schema(
        tags=["Users"],
        summary="Create an user",
        request={"application/json": UserCreateSerializer},
        responses={201: UserSerializer},
    ),
    update=extend_schema(
        tags=["Users"],
        summary="Update an user",
        request={"application/json": UserCreateSerializer},
        responses={200: UserSerializer},
    ),
    destroy=extend_schema(
        tags=["Users"],
        summary="Delete an user",
        responses={204: None},
    ),
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return UserCreateSerializer
        return UserSerializer
