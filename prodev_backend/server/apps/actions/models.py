# server/apps/actions/models.py

from django.db import models
from django.utils import timezone

from server.apps.challenges.models import Challenge
from server.apps.core.models import TimeStampedModel
from server.apps.users.models import CustomUser


class EcoAction(TimeStampedModel):
    """
    Tracks an eco-friendly action performed by a user.
    """

    ACTION_TYPES = [
        ("transport", "Public Transport"),
        ("plastic", "Avoided Plastic"),
        ("vegetarian", "Vegetarian Meal"),
        ("energy", "Energy Saving"),
        ("water", "Water Saving"),
    ]

    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="eco_actions"
    )
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    description = models.CharField(max_length=255)
    points = models.IntegerField(default=0)
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="eco_actions",
    )
    performed_on = models.DateField(default=timezone.now, editable=False, db_index=True)

    def __str__(self):
        return f"{self.user.username} - {self.action_type}"


class Meta:
    constraints = [
        models.UniqueConstraint(
            fields=["user", "action_type", "performed_on"],
            name="unique_daily_action",
        )
    ]


class ActionTemplate(TimeStampedModel):
    """
    Public catalog: things users *can* do.
    """

    ACTION_TYPES = [
        ("transport", "Public Transport"),
        ("plastic", "Avoided Plastic"),
        ("vegetarian", "Vegetarian Meal"),
        ("energy", "Energy Saving"),
        ("water", "Water Saving"),
    ]

    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    description = models.CharField(max_length=255)
    points = models.IntegerField(default=0)
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="action_templates",
    )

    def __str__(self):
        return f"{self.action_type} ({self.points} pts)"
