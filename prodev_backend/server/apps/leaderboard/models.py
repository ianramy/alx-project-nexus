# server/apps/leaderboard/models.py

from django.db import models
from server.apps.users.models import CustomUser
from server.apps.challenges.models import Challenge


class LeaderboardEntry(models.Model):
    """
    Represents a user's score in a specific challenge.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="leaderboard_entries")
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name="leaderboard_entries")
    score = models.IntegerField(default=0)

    class Meta:
        unique_together = ("user", "challenge")
        ordering = ["-score"]

    def __str__(self):
        return f"{self.user.username} - {self.challenge.title}: {self.score} pts"
