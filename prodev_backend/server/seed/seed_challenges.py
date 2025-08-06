# server/seed/seed_challenges.py

"""
Seeds predefined environmental challenges into the database.
"""

from server.apps.challenges.models import Challenge
from datetime import date, timedelta

def run():
    """Seed challenge data into the DB if empty."""

    challenges = [
        {
            "title": "Plastic-Free Week",
            "description": "Avoid all single-use plastic",
            "start_date": date.today(),
            "end_date": date.today() + timedelta(days=7),
        },
        {
            "title": "Meatless Monday",
            "description": "Eat plant-based every Monday",
            "start_date": date.today(),
            "end_date": date.today() + timedelta(days=30),
        },
    ]

    created = 0
    skipped = 0
    for ch in challenges:
        Challenge.objects.create(**ch)
        if created:
            created += 1
        else:
            skipped += 1

    total = created + skipped
    if created == 0:
        print(f"Challenge data already exists. Created: {created}, Skipped: {skipped}, Total processed: {total}")
    else:
        print(f"Challenge seeding complete. Created: {created}, Skipped: {skipped}, Total processed: {total}")
