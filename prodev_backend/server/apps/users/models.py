# server/apps/users/models.py

from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from typing import Optional, TYPE_CHECKING
from server.apps.core.models import TimeStampedModel
from server.apps.location.models import City


if TYPE_CHECKING:
    # Help the type checker understand the FK
    from server.apps.location.models import City as CityType


class CustomUserManager(UserManager["CustomUser"]):
    """Custom manager for CustomUser to properly type the manager."""
    pass


class CustomUser(AbstractUser, TimeStampedModel):
    """
    Custom user model with extended personal and location details.
    """

    # ---- Fields (your existing ones) ----
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    avatar = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    phone_number = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    GENDER_CHOICES = (
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
        ("prefer_not_say", "Prefer not to say"),
    )
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    profile_complete = models.BooleanField(default=False)

    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, related_name="residents")

    # Use custom manager to resolve type conflicts
    objects = CustomUserManager()

    # Type annotations for better IDE support
    if TYPE_CHECKING:
        city: Optional["CityType"]

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return self.email
