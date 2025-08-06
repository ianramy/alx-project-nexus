# server/apps/location/serializers.py

from rest_framework import serializers
from .models import Continent, Country, City


class ContinentSerializer(serializers.ModelSerializer):
    """
    Serializer for Continent.
    Exposes: id, name
    """

    class Meta:
        model = Continent
        fields = ["id", "name"]


class CountrySerializer(serializers.ModelSerializer):
    """
    Serializer for Country.
    Exposes: id, name, code, continent (FK id) and optional nested continent info.
    """
    
    continent_detail = ContinentSerializer(source="continent", read_only=True)

    class Meta:
        model = Country
        fields = ["id", "name", "code", "continent", "continent_detail"]


class CitySerializer(serializers.ModelSerializer):
    """
    Serializer for City.
    Exposes: id, name, country (FK id), and optional nested country/continent info.
    """
    country_detail = CountrySerializer(source="country", read_only=True)
    continent_id = serializers.IntegerField(
        source="country.continent_id", read_only=True, help_text="Convenience: continent id of the city's country."
    )

    class Meta:
        model = City
        fields = ["id", "name", "country", "continent_id", "country_detail"]
