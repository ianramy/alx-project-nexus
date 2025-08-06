# server/seed/seed_notifications.py

"""
Seeds baseline notifications for all users.
"""

from server.apps.users.models import CustomUser
from server.apps.notifications.models import Notification

def run():
    """Create a few helpful starter notifications for each user."""

    base_messages = [
        "Welcome to EcoTracker! Start logging actions to earn points.",
        "New challenges are live this week—jump in and make an impact!",
        "Tip: Link your actions to challenges to climb the leaderboard.",
    ]

    users = CustomUser.objects.all()

    created = 0
    skipped = 0

    for user in users:
        for msg in base_messages:
            Notification.objects.create(user=user, message=msg, is_read=False)
            created += 1

        if not (user.phone_number or user.bio):
            Notification.objects.create(
                user=user,
                message="Complete your profile to help personalize your experience.",
                is_read=False,
            )
            created += 1
        else:
            skipped += 1

    total = created + skipped
    if created == 0:
        print(f"Notification data already exists. Created: {created}, Skipped: {skipped}, Total processed: {total}")
    else:
        print(f"Notification seeding complete. Created: {created}, Skipped: {skipped}, Total processed: {total}")
