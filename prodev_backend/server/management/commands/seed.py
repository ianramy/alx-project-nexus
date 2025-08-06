# server/management/commands/seed.py

from django.core.management.base import BaseCommand
from server.seed import run_seed


class Command(BaseCommand):
    help = "Seeds the database with initial CarbonJar data"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Starting seed_data..."))
        run_seed.run_all()
        self.stdout.write(self.style.SUCCESS("Database successfully seeded!"))

