# server/apps/actions/serializers.py

from rest_framework import serializers
from .models import EcoAction
from server.apps.users.models import CustomUser
from server.apps.challenges.models import Challenge


# Mini Serializers for nesting
class UserChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'avatar']


class ChallengeMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['id', 'title', 'description']

class EcoActionSerializer(serializers.ModelSerializer):
    user = UserChallengeSerializer()
    challenge = ChallengeMiniSerializer()
    class Meta:
        model = EcoAction
        fields = ["id", "user", "action_type", "description", "points", "challenge"]
        
class EcoActionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcoAction
        fields = ["user", "action_type", "description", "points", "challenge"]
