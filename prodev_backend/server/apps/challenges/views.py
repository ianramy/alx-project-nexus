# server/apps/challenges/views.py

from rest_framework import viewsets, permissions
from .models import Challenge
from .serializers import ChallengeSerializer
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter
)


@extend_schema_view(
    list=extend_schema(
        tags=["Challenges"],
        summary="Get all the challenges",
        request=None,
        parameters=[],
    ),
    retrieve=extend_schema(
        tags=["Challenges"],
        summary="Get a specific challenge",
        request=None,
        parameters=[
            OpenApiParameter(
                name="id",
                description="ID of the challenge",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
        ],
    ),
    create=extend_schema(
        tags=["Challenges"],
        summary="Create a challenge",
        request={"application/x-www-form-urlencoded": ChallengeSerializer},
        responses={201: ChallengeSerializer},
    ),
    update=extend_schema(
        tags=["Challenges"],
        summary="Update a challenge",
        request={"application/x-www-form-urlencoded": ChallengeSerializer},
        responses={200: ChallengeSerializer},
    ),
    destroy=extend_schema(
        tags=["Challenges"],
        summary="Delete a challenge",
        responses={204: None},
    ),
)


class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.AllowAny]
