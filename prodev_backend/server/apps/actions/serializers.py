# server/apps/actions/serializers.py

from rest_framework import serializers
from .models import EcoAction


class EcoActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcoAction
        fields = ["id", "user", "action_type", "description", "points", "challenge"]
