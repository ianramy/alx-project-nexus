# server/apps/challenges/serializers.py

from rest_framework import serializers
from .models import Challenge
from server.apps.users.models import CustomUser

# Mini Serializers for nesting
class UserChallengSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'avatar']

class ChallengeSerializer(serializers.ModelSerializer):
    participants = UserChallengSerializer(many=True)
    class Meta:
        model = Challenge
        fields = ["id", "title", "description", "start_date", "end_date", "participants"]

class ChallengeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ["title", "description", "start_date", "end_date"]
