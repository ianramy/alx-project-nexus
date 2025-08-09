# server/apps/challenges/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from .models import Challenge
from .serializers import ChallengeSerializer, ChallengeCreateSerializer
from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter
)
from rest_framework.response import Response


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
        request={"application/x-www-form-urlencoded": ChallengeCreateSerializer,},
        responses={201: ChallengeSerializer},
    ),
    update=extend_schema(
        tags=["Challenges"],
        summary="Update a challenge",
        request={"application/x-www-form-urlencoded": ChallengeCreateSerializer,},
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
        if self.action in ['create', 'update', 'partial_update']:
            return ChallengeCreateSerializer
        return ChallengeSerializer

    def create(self, request, *args, **kwargs):
        create_serializer = self.get_serializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)
        self.perform_create(create_serializer)
        # Use detailed serializer for response
        full_serializer = ChallengeSerializer(create_serializer.instance, context=self.get_serializer_context())
        return Response(full_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        update_serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        update_serializer.is_valid(raise_exception=True)
        self.perform_update(update_serializer)
        # Use detailed serializer for response
        full_serializer = ChallengeSerializer(update_serializer.instance, context=self.get_serializer_context())
        return Response(full_serializer.data)
