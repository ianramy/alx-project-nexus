# server/settings/dev.py
from .base import * #noqa

DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",  # or IsAuthenticated for prod
    ],
}
