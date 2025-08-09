# server/apps/users/profile_views.py

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from drf_spectacular.utils import extend_schema
from server.apps.users.serializers import UserSerializer
from server.apps.leaderboard.serializers import LeaderboardEntrySerializer
from server.apps.challenges.serializers import ChallengeSerializer
from server.apps.actions.serializers import EcoActionSerializer
from server.apps.leaderboard.models import LeaderboardEntry
from server.apps.challenges.models import Challenge
from server.apps.actions.models import EcoAction


@extend_schema(tags=["Profile"], summary="Get current user's profile")
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


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
