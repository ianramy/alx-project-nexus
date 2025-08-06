# server/apps/notifications/models.py

from django.db import models
from server.apps.users.models import CustomUser
from server.apps.core.models import TimeStampedModel


class Notification(TimeStampedModel):
    """
    User-specific notification for alerts and messages.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"To: {self.user.email} | Read: {self.is_read}"
