# server/apps/challenges/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.decorators import action
from django.utils import timezone
from .models import Challenge
from .serializers import ChallengeSerializer, ChallengeCreateSerializer
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter
)
from rest_framework.response import Response
from drf_spectacular.types import OpenApiTypes


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
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
            ),
        ],
    ),
    create=extend_schema(
        tags=["Challenges"],
        summary="Create a challenge",
        request={"application/x-www-form-urlencoded": ChallengeCreateSerializer},
        responses={201: ChallengeSerializer},
    ),
    update=extend_schema(
        tags=["Challenges"],
        summary="Update a challenge",
        request={"application/x-www-form-urlencoded": ChallengeCreateSerializer},
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
    parser_classes = [FormParser, MultiPartParser, JSONParser]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ChallengeCreateSerializer
        return ChallengeSerializer

    def create(self, request, *args, **kwargs):
        create_serializer = self.get_serializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)
        self.perform_create(create_serializer)
        full_serializer = ChallengeSerializer(
            create_serializer.instance, context=self.get_serializer_context()
        )
        return Response(full_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        update_serializer = self.get_serializer(
            instance, data=request.data, partial=kwargs.get("partial", False)
        )
        update_serializer.is_valid(raise_exception=True)
        self.perform_update(update_serializer)
        full_serializer = ChallengeSerializer(
            update_serializer.instance, context=self.get_serializer_context()
        )
        return Response(full_serializer.data)

    # ---------- CUSTOM ACTIONS ----------

    @extend_schema(
        tags=["Challenges"],
        summary="Join this challenge (adds current user to participants)",
        responses={
            200: ChallengeSerializer,
            201: ChallengeSerializer,
            400: None,
            401: None,
        },
    )
    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def join(self, request, pk=None):
        challenge = self.get_object()
        today = timezone.localdate()

        # Optional: block joining ended challenges
        if challenge.end_date and challenge.end_date < today:
            return Response(
                {"detail": "This challenge has ended."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create (or get) the through model row
        from server.apps.leaderboard.models import LeaderboardEntry

        entry, created = LeaderboardEntry.objects.get_or_create(
            challenge=challenge,
            user=request.user,
            defaults={"score": 0},
        )

        # Reload participants via serializer
        data = ChallengeSerializer(
            challenge, context=self.get_serializer_context()
        ).data
        return Response(
            data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    @extend_schema(
        tags=["Challenges"],
        summary="Leave this challenge (removes current user from participants)",
        responses={204: None, 401: None},
    )
    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def leave(self, request, pk=None):
        challenge = self.get_object()
        from server.apps.leaderboard.models import LeaderboardEntry

        LeaderboardEntry.objects.filter(challenge=challenge, user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
