# server/apps/users/profile_views.py

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from drf_spectacular.utils import extend_schema
from server.apps.users.serializers import UserSerializer, UserUpdateSerializer, ChangePasswordSerializer
from server.apps.leaderboard.serializers import LeaderboardEntrySerializer
from server.apps.challenges.serializers import ChallengeSerializer
from server.apps.actions.serializers import EcoActionSerializer
from server.apps.leaderboard.models import LeaderboardEntry
from server.apps.challenges.models import Challenge
from server.apps.actions.models import EcoAction
from rest_framework import status


@extend_schema(tags=["Profile"], methods=["GET"], responses=UserSerializer)
@extend_schema(
    tags=["Profile"],
    methods=["PUT"],
    request=UserUpdateSerializer,
    responses=UserSerializer,
)
@extend_schema(
    tags=["Profile"],
    methods=["PATCH"],
    request=UserUpdateSerializer,
    responses=UserSerializer,
)
@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def me(request):
    if request.method in ("PUT", "PATCH"):
        partial = request.method == "PATCH"
        serializer = UserUpdateSerializer(
            instance=request.user, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

    return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


@extend_schema(
    tags=["Profile"],
    summary="Change current user's password",
    request=ChangePasswordSerializer,
    responses={200: {"type": "object", "properties": {"detail": {"type": "string"}}}},
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(
        data=request.data, context={"user": request.user}
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(
        {"detail": "Password updated successfully."}, status=status.HTTP_200_OK
    )


@extend_schema(tags=["Profile"], summary="Get current user's leaderboard entries")
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_leaderboard(request):
    entries = LeaderboardEntry.objects.filter(user=request.user)
    serializer = LeaderboardEntrySerializer(entries, many=True)
    return Response(serializer.data)


@extend_schema(tags=["Profile"], summary="Get current user's challenges")
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_challenges(request):
    challenges = Challenge.objects.filter(participants=request.user)
    serializer = ChallengeSerializer(challenges, many=True)
    return Response(serializer.data)


@extend_schema(tags=["Profile"], summary="Get current user's eco actions")
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_actions(request):
    actions = EcoAction.objects.filter(user=request.user)
    serializer = EcoActionSerializer(actions, many=True)
    return Response(serializer.data)
