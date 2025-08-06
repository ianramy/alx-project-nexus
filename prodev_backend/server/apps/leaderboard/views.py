# server/apps/leaderboard/views.py

from rest_framework import viewsets, permissions
from .models import LeaderboardEntry
from .serializers import LeaderboardEntrySerializer
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter
)


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
        request={"application/x-www-form-urlencoded": LeaderboardEntrySerializer},
        responses={201: LeaderboardEntrySerializer},
    ),
    update=extend_schema(
        tags=["Leaderboards"],
        summary="Update a leaderboard",
        request={"application/x-www-form-urlencoded": LeaderboardEntrySerializer},
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
