# server/apps/notifications/serializers.py

from rest_framework import serializers
from .models import Notification
from server.apps.users.models import CustomUser


# Mini Serializers for nesting
class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'avatar']



class NotificationSerializer(serializers.ModelSerializer):
    user = UserNotificationSerializer()
    class Meta:
        model = Notification
        fields = ["id", "user", "message", "is_read"]

class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["user", "message", "is_read"]
