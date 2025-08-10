# server/seed/seed_challenges.py

"""
Seeds predefined environmental challenges into the database.
"""

from datetime import date, timedelta
from django.db import transaction
from server.apps.challenges.models import Challenge

CATALOG = [
    {
        "title": "Plastic-Free Week",
        "description": "Avoid single-use plastic for a full week.",
        "duration_days": 7,
    },
    {
        "title": "Vegetarian Mondays",
        "description": "Eat plant-based every Monday for a month.",
        "duration_days": 30,
    },
    {
        "title": "Energy Saver Sprint",
        "description": "Trim your electricity use with daily micro-habits.",
        "duration_days": 21,
    },
    {
        "title": "Water-Wise Week",
        "description": "Conserve water with simple daily steps.",
        "duration_days": 7,
    },
    {
        "title": "Car-Free Commute",
        "description": "Ditch the solo drive — bus, bike, or walk!",
        "duration_days": 14,
    },
]


@transaction.atomic
def run():
    today = date.today()
    created = 0
    skipped_existing = 0
    found_duplicates = 0

    for item in CATALOG:
        title = item["title"]
        qs = Challenge.objects.filter(title=title)
        count = qs.count()

        if count >= 1:
            # Already have one (or more) with this title → skip creating anything new.
            skipped_existing += 1
            if count > 1:
                found_duplicates += count - 1  # just so you know they’re there
            continue

        # Create a fresh row (no updates of previous rows)
        Challenge.objects.create(
            title=title,
            description=item["description"],
            start_date=today,
            end_date=today + timedelta(days=item["duration_days"]),
        )
        created += 1

    total = Challenge.objects.count()
    print(
        f"[challenges] created: {created}, skipped(existing title): {skipped_existing}, duplicates_detected(but kept): {found_duplicates}, total: {total}"
    )
