# server/apps/leaderboard/serializers.py

from rest_framework import serializers
from .models import LeaderboardEntry
from server.apps.users.models import CustomUser
from server.apps.challenges.models import Challenge


# Mini Serializers for nesting
class UserLeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'avatar']


class ChallengeLeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['id', 'title', 'description']

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    user = UserLeaderboardSerializer()
    challenge = ChallengeLeaderboardSerializer()
    class Meta:
        model = LeaderboardEntry
        fields = ["id", "user", "challenge", "score"]

class LeaderboardCreateSerializer(serializers.ModelSerializer):
    # Use PrimaryKeyRelatedField to accept IDs in form/json input
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    challenge = serializers.PrimaryKeyRelatedField(queryset=Challenge.objects.all())

    class Meta:
        model = LeaderboardEntry
        fields = ["user", "challenge", "score"]

    def validate(self, attrs):
        if LeaderboardEntry.objects.filter(
            user=attrs["user"], challenge=attrs["challenge"]
        ).exists():
            raise serializers.ValidationError(
                "This user already has an entry for this challenge."
            )
        return attrs
class LeaderboardUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = ["user", "challenge", "score"]

    def validate_score(self, value):
        if value < 0:
            raise serializers.ValidationError("Score cannot be negative.")
        return value
