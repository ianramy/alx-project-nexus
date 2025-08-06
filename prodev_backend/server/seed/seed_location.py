# server/seed/seed_location.py

"""
Seeds the location hierarchy
"""

from typing import Dict, List, Tuple
from server.apps.location.models import Continent, Country, City


def _ensure_continent(name: str) -> Tuple[Continent, bool]:
    return Continent.objects.get_or_create(name=name)

def _ensure_country(continent: Continent, name: str, code: str) -> Tuple[Country, bool]:
    return Country.objects.get_or_create(
        code=code.upper(),
        defaults={"name": name, "continent": continent},
    )

def _ensure_city(country: Country, name: str) ->Tuple[City, bool]:
    return City.objects.get_or_create(name=name, country=country)


def run():
    """Entry point for seeding the location hierarchy (continents, countries, capitals)."""

    data: Dict[str, List[Dict[str, str]]] = {
        "Africa": [
            {"name": "Kenya", "code": "KE", "capital": "Nairobi"},
            {"name": "Nigeria", "code": "NG", "capital": "Abuja"},
            {"name": "Egypt", "code": "EG", "capital": "Cairo"},
            {"name": "South Africa", "code": "ZA", "capital": "Pretoria"},
            {"name": "Ethiopia", "code": "ET", "capital": "Addis Ababa"},
        ],
        "Asia": [
            {"name": "China", "code": "CN", "capital": "Beijing"},
            {"name": "India", "code": "IN", "capital": "New Delhi"},
            {"name": "Japan", "code": "JP", "capital": "Tokyo"},
            {"name": "Indonesia", "code": "ID", "capital": "Jakarta"},
            {"name": "Saudi Arabia", "code": "SA", "capital": "Riyadh"},
        ],
        "Europe": [
            {"name": "Germany", "code": "DE", "capital": "Berlin"},
            {"name": "France", "code": "FR", "capital": "Paris"},
            {"name": "United Kingdom", "code": "GB", "capital": "London"},
            {"name": "Italy", "code": "IT", "capital": "Rome"},
            {"name": "Spain", "code": "ES", "capital": "Madrid"},
        ],
        "North America": [
            {"name": "United States", "code": "US", "capital": "Washington, D.C."},
            {"name": "Canada", "code": "CA", "capital": "Ottawa"},
            {"name": "Mexico", "code": "MX", "capital": "Mexico City"},
            {"name": "Cuba", "code": "CU", "capital": "Havana"},
            {"name": "Guatemala", "code": "GT", "capital": "Guatemala City"},
        ],
        "South America": [
            {"name": "Brazil", "code": "BR", "capital": "Brasília"},
            {"name": "Argentina", "code": "AR", "capital": "Buenos Aires"},
            {"name": "Colombia", "code": "CO", "capital": "Bogotá"},
            {"name": "Chile", "code": "CL", "capital": "Santiago"},
            {"name": "Peru", "code": "PE", "capital": "Lima"},
        ],
        "Oceania": [
            {"name": "Australia", "code": "AU", "capital": "Canberra"},
            {"name": "New Zealand", "code": "NZ", "capital": "Wellington"},
            {"name": "Fiji", "code": "FJ", "capital": "Suva"},
            {"name": "Papua New Guinea", "code": "PG", "capital": "Port Moresby"},
            {"name": "Samoa", "code": "WS", "capital": "Apia"},
        ],
    }

    created = 0
    skipped = 0

    for continent_name, countries in data.items():
        continent, cont_created = _ensure_continent(continent_name)
        if cont_created:
            created += 1
        else:
            skipped += 1

        for c in countries:
            country, country_created = _ensure_country(continent, c["name"], c["code"])
            if country_created:
                created += 1
            else:
                skipped += 1

            if "capital" in c:
                city, city_created = _ensure_city(country, c["capital"])
                if city_created:
                    created += 1
                else:
                    skipped += 1

    total = created + skipped
    if created == 0:
        print(f"Location data already exists. Created: {created}, Skipped: {skipped}, Total processed: {total}")
    else:
        print(f"Location seeding complete. Created: {created}, Skipped: {skipped}, Total processed: {total}")
