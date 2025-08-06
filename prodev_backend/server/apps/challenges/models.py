# server/apps/challenges/models.py

from django.db import models
from server.apps.core.models import TimeStampedModel
from server.apps.users.models import CustomUser


class Challenge(TimeStampedModel):
    """
    Represents a challenge users can participate in and earn points.
    """
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    participants = models.ManyToManyField(
        CustomUser,
        through="leaderboard.LeaderboardEntry",
        related_name="challenges",
        blank=True
    )

    def __str__(self):
        return self.title
