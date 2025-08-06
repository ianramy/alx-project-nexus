# server/apps/actions/apps.py

from django.apps import AppConfig


class ActionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'server.apps.actions'
    label = "actions"
