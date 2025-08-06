# server/seed/seed_users.py

"""
Seeds initial CustomUser entries into the database
"""

from datetime import date
from typing import Dict, List, TYPE_CHECKING
from django.db import transaction
from server.apps.users.models import CustomUser

# Try to import City model to check if location app is available
try:
    from server.apps.location.models import City
    HAS_CITY = True
except ImportError:
    HAS_CITY = False
    if TYPE_CHECKING:
        from server.apps.location.models import City


def _fetch_capital_cities() -> Dict[str, "City"]:
    """
    Build a quick lookup of capital city name -> City instance for convenience.
    """
    if not HAS_CITY:
        return {}

    # Must match the capitals you seeded in seed_location.py
    capital_names = [
        # Africa
        "Nairobi", "Abuja", "Cairo", "Pretoria", "Addis Ababa",
        # Asia
        "Beijing", "New Delhi", "Tokyo", "Jakarta", "Riyadh",
        # Europe
        "Berlin", "Paris", "London", "Rome", "Madrid",
        # North America
        "Washington, D.C.", "Ottawa", "Mexico City", "Havana", "Guatemala City",
        # South America
        "Brasília", "Buenos Aires", "Bogotá", "Santiago", "Lima",
        # Oceania
        "Canberra", "Wellington", "Suva", "Port Moresby", "Apia",
    ]

    cities = City.objects.filter(name__in=capital_names)
    return {c.name: c for c in cities}


def run():
    """
    Seed predefined users if not already present.
    """
    seed_data: List[Dict] = [
        {
            "username": "eco_warrior",
            "email": "eco@example.com",
            "first_name": "Eco",
            "last_name": "Warrior",
            "phone_number": "+254700000001",
            "date_of_birth": date(1995, 5, 17),
            "gender": "other",
            "bio": "Fighting climate change one action at a time.",
            "avatar": None,
            "profile_complete": True,
            "preferred_capital": "Nairobi",
        },
        {
            "username": "green_guru",
            "email": "green@example.com",
            "first_name": "Green",
            "last_name": "Guru",
            "phone_number": "+254700000002",
            "date_of_birth": date(1992, 9, 3),
            "gender": "prefer_not_say",
            "bio": "Plant-powered productivity enthusiast.",
            "avatar": None,
            "profile_complete": True,
            "preferred_capital": "Berlin",
        },
        {
            "username": "carbon_crusher",
            "email": "crusher@example.com",
            "first_name": "Carbon",
            "last_name": "Crusher",
            "phone_number": "+254700000003",
            "date_of_birth": date(1990, 1, 23),
            "gender": "male",
            "bio": "Measuring, reducing, and offsetting footprints.",
            "avatar": None,
            "profile_complete": True,
            "preferred_capital": "Tokyo",
        },
        {
            "username": "plastic_banisher",
            "email": "banisher@example.com",
            "first_name": "Plastic",
            "last_name": "Banisher",
            "phone_number": "+254700000004",
            "date_of_birth": date(1998, 12, 11),
            "gender": "female",
            "bio": "Reusable everything. Refuse, reduce, reuse, recycle.",
            "avatar": None,
            "profile_complete": True,
            "preferred_capital": "Paris",
        },
        {
            "username": "renewable_ryder",
            "email": "ryder@example.com",
            "first_name": "Renewable",
            "last_name": "Ryder",
            "phone_number": "+254700000005",
            "date_of_birth": date(1993, 6, 8),
            "gender": "other",
            "bio": "Solar by day, wind by night.",
            "avatar": None,
            "profile_complete": True,
            "preferred_capital": "Canberra",
        },
    ]

    # Try to map preferred capitals to existing City objects (if location app is present)
    capitals_by_name = _fetch_capital_cities() if HAS_CITY else {}

    created = 0
    skipped = 0

    with transaction.atomic():
        for entry in seed_data:
            email = entry["email"]
            username = entry["username"]

            # Pop non-model helper key
            preferred_capital = entry.pop("preferred_capital", None)

            # Prepare defaults for creation
            defaults = {
                "username": username,
                "first_name": entry.get("first_name"),
                "last_name": entry.get("last_name"),
                "phone_number": entry.get("phone_number"),
                "date_of_birth": entry.get("date_of_birth"),
                "gender": entry.get("gender"),
                "bio": entry.get("bio"),
                "avatar": entry.get("avatar"),
                "profile_complete": entry.get("profile_complete", False),
            }

            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults=defaults,
            )

            if created:
                # Attach city if available
                if HAS_CITY and preferred_capital and preferred_capital in capitals_by_name:
                    user.city = capitals_by_name[preferred_capital]

                # Set a default password for demo purposes
                user.set_password("password123")
                user.save()
                created += 1
            else:
                skipped += 1

    total = created + skipped
    if created == 0:
        print(f"User data already exists. Created: {created}, Skipped: {skipped}, Total processed: {total}")
    else:
        print(f"User seeding complete. Created: {created}, Skipped: {skipped}, Total processed: {total}")
