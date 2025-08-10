# server/apps/users/serializers.py

"""
User serializers for read/write operations.
"""

from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from server.apps.location.models import City


class CityMinimalSerializer(serializers.ModelSerializer):
    """
    Minimal read-only projection of a City with country & continent context.
    """
    country_id = serializers.IntegerField(source="country.id", read_only=True)
    country_name = serializers.CharField(source="country.name", read_only=True)
    continent_id = serializers.IntegerField(
        source="country.continent.id", read_only=True
    )
    continent_name = serializers.CharField(
        source="country.continent.name", read_only=True
    )

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
    Read serializer for CustomUser.
    """

    avatar = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    bio = serializers.CharField(required=False, allow_null=True, allow_blank=True)

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
    Write serializer for creating CustomUser instances.
    Includes password write logic and city input.
    """

    avatar = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    bio = serializers.CharField(required=False, allow_null=True, allow_blank=True)

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


class UserUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=False, max_length=150)
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    avatar = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    bio = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    gender = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = CustomUser
        # Only include fields you WANT writable via /me/ (and PUT/PATCH on ViewSet).
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "bio",
            "phone_number",
            "date_of_birth",
            "gender",
            "city",
        ]

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance

    def create(self, validated_data):
        raise NotImplementedError("Use update only")


class ChangePasswordSerializer(serializers.Serializer):
    """
    POST /users/me/password/ payload.
    """

    current_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(write_only=True, trim_whitespace=False)
    re_new_password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_current_password(self, value):
        user = self.context["user"]
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, attrs):
        if attrs["new_password"] != attrs["re_new_password"]:
            raise serializers.ValidationError(
                {"re_new_password": "Passwords do not match."}
            )
        # Run Django’s password validators
        try:
            validate_password(attrs["new_password"], self.context["user"])
        except DjangoValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        # Prevent no-op changes
        if attrs["new_password"] == attrs["current_password"]:
            raise serializers.ValidationError(
                {"new_password": "New password must be different."}
            )
        return attrs

    def save(self, **kwargs):
        user = self.context["user"]
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user
