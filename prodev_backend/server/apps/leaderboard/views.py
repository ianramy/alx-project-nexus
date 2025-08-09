# server/apps/leaderboard/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from .models import LeaderboardEntry
from .serializers import LeaderboardEntrySerializer, LeaderboardCreateSerializer, LeaderboardUpdateSerializer
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter
)
from rest_framework.response import Response


@extend_schema_view(
    list=extend_schema(
        tags=["Leaderboards"],
        summary="Get all the leaderboards",
        request=None,
        parameters=[],
    ),
    retrieve=extend_schema(
        tags=["Leaderboards"],
        summary="Get a specific leaderboard",
        request=None,
        parameters=[
            OpenApiParameter(
                name="id",
                description="ID of the leaderboard",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
    ),
    create=extend_schema(
        tags=["Leaderboards"],
        summary="Create a leaderboard",
        request={"application/x-www-form-urlencoded": LeaderboardCreateSerializer},
        responses={201: LeaderboardEntrySerializer},
    ),
    update=extend_schema(
        tags=["Leaderboards"],
        summary="Update a leaderboard",
        request={"application/x-www-form-urlencoded": LeaderboardUpdateSerializer},
        responses={200: LeaderboardEntrySerializer},
    ),
    destroy=extend_schema(
        tags=["Leaderboards"],
        summary="Delete a leaderboard",
        responses={204: None},
    ),
)


class LeaderboardViewSet(viewsets.ModelViewSet):
    """
    Leaderboards CRUD Operations
    """
    queryset = LeaderboardEntry.objects.all()
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_serializer_class(self):
        if self.action == 'create':
            return LeaderboardCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return LeaderboardUpdateSerializer
        return LeaderboardEntrySerializer

    def create(self, request, *args, **kwargs):
        create_serializer = self.get_serializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)
        self.perform_create(create_serializer)
        # Use detailed serializer for response
        full_serializer = LeaderboardEntrySerializer(create_serializer.instance, context=self.get_serializer_context())
        return Response(full_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        update_serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        update_serializer.is_valid(raise_exception=True)
        self.perform_update(update_serializer)
        # Use detailed serializer for response
        full_serializer = LeaderboardEntrySerializer(update_serializer.instance, context=self.get_serializer_context())
        return Response(full_serializer.data)
