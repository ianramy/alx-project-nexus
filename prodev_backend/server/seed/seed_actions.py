# server/seed/seed_actions.py

"""
Seeds random EcoActions for each user.
"""

from server.apps.actions.models import EcoAction
from server.apps.users.models import CustomUser
from server.apps.challenges.models import Challenge
import random

def run():
    """Seed 5 random eco actions per user."""

    action_types = ["transport", "plastic", "meatless"]
    descriptions = {
        "transport": "Used the bus instead of car",
        "plastic": "Used reusable bag at the store",
        "meatless": "Ate a plant-based meal",
    }

    users = CustomUser.objects.all()
    challenges = list(Challenge.objects.all())

    created = 0
    skipped = 0

    for user in users:
        for _ in range(5):
            action = random.choice(action_types)
            EcoAction.objects.create(
                user=user,
                action_type=action,
                description=descriptions[action],
                points=random.randint(5, 20),
                challenge=random.choice(challenges) if challenges else None,
            )
            if created:
                created += 1
            else:
                skipped += 1

    total = created + skipped
    if created == 0:
        print(f"Action data already exists. Created: {created}, Skipped: {skipped}, Total processed: {total}")
    else:
        print(f"Action seeding complete. Created: {created}, Skipped: {skipped}, Total processed: {total}")
