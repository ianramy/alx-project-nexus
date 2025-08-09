# server/apps/users/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from .models import CustomUser
from .serializers import UserSerializer, UserCreateSerializer
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter
)
from rest_framework.response import Response


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

    def create(self, request, *args, **kwargs):
        create_serializer = self.get_serializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)
        self.perform_create(create_serializer)
        # Use detailed serializer for response
        full_serializer = UserSerializer(create_serializer.instance, context=self.get_serializer_context())
        return Response(full_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        update_serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        update_serializer.is_valid(raise_exception=True)
        self.perform_update(update_serializer)
        # Use detailed serializer for response
        full_serializer = UserSerializer(update_serializer.instance, context=self.get_serializer_context())
        return Response(full_serializer.data)
