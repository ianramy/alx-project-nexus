# server/seed/run_seed.py

"""
Master runner script to trigger all seeders for users, challenges, and eco actions.
"""

import sys
from django.core.management import call_command
from server.seed import (
    seed_users,
    seed_actions,
    seed_challenges,
    seed_location,
    seed_notifications,
)

def reset_db():
    print("WARNING: This will drop and recreate your DB schema.")
    confirm = input("Type 'yes' to continue: ")
    if confirm.lower() == 'yes':
        call_command('flush', '--no-input')
        print("Database reset complete.\n")
    else:
        print("Reset cancelled. Continuing with existing data...\n")

def run_all():
    print("\nSeeding data into DB...\n")
    seed_location.run()
    seed_users.run()
    seed_challenges.run()
    seed_actions.run()
    seed_notifications.run()
    print("\nSeeding complete!")

if __name__ == "__main__":
    if '--reset' in sys.argv:
        reset_db()

    run_all()
