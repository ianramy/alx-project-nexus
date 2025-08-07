# server/apps/users/serializers.py

"""
User serializers for read/write operations.
"""

from rest_framework import serializers
from .models import CustomUser
from server.apps.location.models import City


class CityMinimalSerializer(serializers.ModelSerializer):
    """
    Minimal read-only projection of a City with country & continent context.
    """
    country_id = serializers.IntegerField(source="country.id", read_only=True)
    country_name = serializers.CharField(source="country.name", read_only=True)
    continent_id = serializers.IntegerField(source="country.continent.id", read_only=True)
    continent_name = serializers.CharField(source="country.continent.name", read_only=True)

    class Meta:
        model = City
        fields = [
            "id",
            "name",
            "country_id",
            "country_name",
            "continent_id",
            "continent_name",
        ]
        read_only_fields = fields


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomUser 
    """
    avatar = serializers.URLField(required=False, allow_null=True)
    bio = serializers.CharField(required=False, allow_null=True)

    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(),
        required=False,
        allow_null=True,
        help_text="Primary key of the City (from /api/location/cities/).",
    )
    city_detail = CityMinimalSerializer(source="city", read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "bio",
            "phone_number",
            "date_of_birth",
            "gender",
            "profile_complete",
            "city",
            "city_detail",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "city_detail"]
        extra_kwargs = {
            "username": {"required": True},
            "email": {"required": True},
        }


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating CustomUser instances.
    Includes password write logic and city input.
    """
    avatar = serializers.URLField(required=False, allow_null=True)
    bio = serializers.CharField(required=False, allow_null=True)

    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(),
        required=False,
        allow_null=True,
        help_text="Primary key of the City (from /api/location/cities/).",
    )

    # Password handling
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        help_text="Write-only. Required on create; optional on update.",
    )

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "bio",
            "phone_number",
            "date_of_birth",
            "gender",
            "profile_complete",
            "city",
            "password",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "username": {"required": True},
            "email": {"required": True},
        }

    def validate_gender(self, value: str):
        """
        Validate gender against model choices if provided.
        Keeps serializer resilient if model choices change.
        """
        if value in (None, ""):
            return value
        gender_field = CustomUser._meta.get_field("gender")
        if getattr(gender_field, "choices", ()):
            valid = {c[0] for c in gender_field.choices}
            if value not in valid:
                raise serializers.ValidationError(
                    f"Invalid gender. Expected one of: {', '.join(sorted(valid))}"
                )
        return value

    def create(self, validated_data):
        """
        Create user and hash password properly.
        """
        password = validated_data.pop("password")
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        """
        Update user fields.
        If `password` is provided, hash and set it; otherwise ignore.
        """
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance
