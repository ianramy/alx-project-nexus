# server/seed/seed_actions.py

"""
Seed ActionTemplate (public catalog) and sample EcoAction logs.
"""

import random
from datetime import timedelta
from typing import Dict, List, Tuple

from django.db import transaction
from django.utils import timezone

from server.apps.actions.models import ActionTemplate, EcoAction
from server.apps.challenges.models import Challenge
from server.apps.users.models import CustomUser

# ---- CONFIG ------------------------------------------------------------------

TEMPLATES: Dict[str, List[str]] = {
    "plastic": [
        "Recycled plastic bottles",
        "Used a reusable shopping bag",
        "Refilled a reusable water bottle",
        "Avoided single-use cutlery",
        "Recycled food containers properly",
    ],
    "vegetarian": [
        "Plant-based breakfast",
        "Vegetarian Monday lunch",
        "Vegan dinner at home",
        "Tofu stir-fry instead of meat",
        "Legume-powered protein meal",
    ],
    "energy": [
        "Turned off lights when not in use",
        "Unplugged idle chargers",
        "Used natural light during the day",
        "Laptop on energy saver mode",
        "Air-dried clothes instead of dryer",
    ],
    "water": [
        "Took a 5-minute shower",
        "Turned off tap while brushing",
        "Collected rainwater for plants",
        "Fixed a dripping faucet",
        "Ran washing machine with a full load",
    ],
    "transport": [
        "Took the bus instead of car",
        "Cycled to work or school",
        "Carpooled with a friend",
        "Walked for short errands",
        "Combined trips to reduce driving",
    ],
}

POINTS: Dict[str, Tuple[int, int]] = {
    "plastic": (5, 12),
    "vegetarian": (8, 18),
    "energy": (3, 10),
    "water": (3, 10),
    "transport": (10, 25),
}

# Category → preferred challenge title (no deletes; we just attach new rows here)
CATEGORY_TO_CHALLENGE: Dict[str, str] = {
    "plastic": "Plastic-Free Week",
    "vegetarian": "Vegetarian Mondays",
    "meatless": "Vegetarian Mondays",  # synonym for model choices
    "energy": "Energy Saver Sprint",
    "water": "Water-Wise Week",
    "transport": "Car-Free Commute",
}

LOGS_PER_USER_RANGE = (6, 14)
DAYS_BACK = 30

# ---- HELPERS -----------------------------------------------------------------


def _allowed_types() -> set:
    """Read allowed action_type choices from EcoAction (if defined)."""
    try:
        return {k for (k, _v) in EcoAction.ACTION_TYPES}  # type: ignore[attr-defined]
    except Exception:
        return set()


def normalize_action_type(cat: str, allowed: set) -> str:
    c = (cat or "").strip().lower()
    if not allowed:
        return c
    if c in allowed:
        return c
    # common synonyms
    if c == "vegetarian" and "meatless" in allowed:
        return "meatless"
    if c == "plant" and "meatless" in allowed:
        return "meatless"
    # fallback: pick *some* allowed value (keeps seeder running)
    return next(iter(allowed)) if allowed else c


def rand_points(cat: str) -> int:
    lo, hi = POINTS.get(cat, (5, 15))
    return random.randint(lo, hi)


def rand_date_within(days: int):
    return timezone.localdate() - timedelta(days=random.randint(0, days))


def _pick_challenge(title: str | None):
    """
    Return ONE challenge to attach new rows to.
    If multiple with same title exist, pick the earliest (keep history intact).
    """
    if not title:
        return None
    return Challenge.objects.filter(title=title).order_by("id").first()


def _has_field(model, name: str) -> bool:
    try:
        model._meta.get_field(name)  # type: ignore[attr-defined]
        return True
    except Exception:
        return False


# ---- SEEDING -----------------------------------------------------------------


@transaction.atomic
def run():
    allowed = _allowed_types()
    has_performed_on = _has_field(EcoAction, "performed_on")

    # 1) Seed ActionTemplate catalog (skip if (action_type, description) exists)
    created_templates = 0
    skipped_templates = 0

    for raw_cat, descriptions in TEMPLATES.items():
        norm_cat = normalize_action_type(raw_cat, allowed)
        ch_title = CATEGORY_TO_CHALLENGE.get(raw_cat) or CATEGORY_TO_CHALLENGE.get(
            norm_cat
        )
        challenge = _pick_challenge(ch_title)

        for desc in descriptions:
            if ActionTemplate.objects.filter(
                action_type=norm_cat, description=desc
            ).exists():
                skipped_templates += 1
                continue
            ActionTemplate.objects.create(
                action_type=norm_cat,
                description=desc,
                points=rand_points(raw_cat),
                challenge=challenge,  # may be None; we do not modify existing rows
            )
            created_templates += 1

    print(
        f"[templates] created: {created_templates}, skipped(existing): {skipped_templates}, total: {ActionTemplate.objects.count()}"
    )

    # 2) Seed EcoAction logs for users (skip if an identical log already exists for that day)
    users = list(CustomUser.objects.all())
    templates = list(ActionTemplate.objects.all())
    if not users or not templates:
        print("[logs] Skipping logs: need at least 1 user and 1 template.")
        return

    created_logs = 0
    skipped_logs = 0

    for user in users:
        target = random.randint(*LOGS_PER_USER_RANGE)
        sample = random.sample(templates, k=min(target, len(templates)))
        for tpl in sample:
            cat = normalize_action_type(tpl.action_type, allowed)
            performed_on = rand_date_within(DAYS_BACK)

            # Detect duplicates of the *same* thing on the same day for that user
            filter_kwargs = dict(
                user=user, action_type=cat, description=tpl.description
            )
            if has_performed_on:
                filter_kwargs["performed_on"] = performed_on  # type: ignore[index]

            if EcoAction.objects.filter(**filter_kwargs).exists():
                skipped_logs += 1
                continue

            create_kwargs = dict(
                user=user,
                action_type=cat,
                description=tpl.description,
                points=tpl.points,
                challenge=tpl.challenge,
            )
            if has_performed_on:
                create_kwargs["performed_on"] = performed_on  # type: ignore[index]

            EcoAction.objects.create(**create_kwargs)
            created_logs += 1

    print(
        f"[logs] created: {created_logs}, skipped(existing): {skipped_logs}, users: {len(users)}"
    )
    print("Seed complete (no deletions, no overwrites)")
