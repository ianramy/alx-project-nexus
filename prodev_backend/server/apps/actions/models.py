# server/apps/actions/models.py

from django.db import models
from server.apps.core.models import TimeStampedModel
from server.apps.users.models import CustomUser
from server.apps.challenges.models import Challenge


class EcoAction(TimeStampedModel):
    """
    Tracks an eco-friendly action performed by a user.
    """
    ACTION_TYPES = [
        ("transport", "Public Transport"),
        ("plastic", "Avoided Plastic"),
        ("meatless", "Meatless Meal"),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="eco_actions")
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    description = models.CharField(max_length=255)
    points = models.IntegerField(default=0)
    challenge = models.ForeignKey(Challenge, on_delete=models.SET_NULL, null=True, blank=True, related_name="eco_actions")

    def __str__(self):
        return f"{self.user.username} - {self.action_type}"
