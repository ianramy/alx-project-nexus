# server/apps/location/models.py

from django.db import models


class Continent(models.Model):
    """Represents a continent e.g. Africa, Asia, Europe"""
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Country(models.Model):
    """Represents a country, linked to a continent"""
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3, unique=True)
    continent = models.ForeignKey(Continent, on_delete=models.CASCADE, related_name="countries")

    def __str__(self):
        return self.name


class City(models.Model):
    """Represents a city, linked to a country"""
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="cities")

    def __str__(self):
        return f"{self.name}, {self.country.name}"
