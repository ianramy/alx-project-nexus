# server/apps/challenges/apps.py

from django.apps import AppConfig


class ChallengesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'server.apps.challenges'
    label = "challenges"
