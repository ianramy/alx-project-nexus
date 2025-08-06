# server/apps/leaderboard/apps.py

from django.apps import AppConfig


class LeaderboardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'server.apps.leaderboard'
    label = "leaderboard"
