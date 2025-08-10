# server/apps/actions/signals.py

from django.db.models.signals import post_save, pre_save, post_delete
from django.db.models import F
from django.dispatch import receiver

from .models import EcoAction
from server.apps.leaderboard.models import LeaderboardEntry


def _ensure_entry(user, challenge):
    if not user or not challenge:
        return None
    entry, _ = LeaderboardEntry.objects.get_or_create(
        user=user,
        challenge=challenge,
        defaults={"score": 0},
    )
    return entry


@receiver(pre_save, sender=EcoAction)
def ecoaction_pre_save_capture(sender, instance: EcoAction, **kwargs):
    """
    Store previous state on the instance so post_save can compute a delta.
    """
    if instance.pk:
        try:
            prev = EcoAction.objects.get(pk=instance.pk)
        except EcoAction.DoesNotExist:
            prev = None
    else:
        prev = None
    instance._prev = prev  # attach for later use


@receiver(post_save, sender=EcoAction)
def ecoaction_post_save_update_leaderboard(
    sender, instance: EcoAction, created: bool, **kwargs
):
    prev = getattr(instance, "_prev", None)

    # If no challenge, nothing to tally
    if created:
        if instance.challenge:
            entry = _ensure_entry(instance.user, instance.challenge)
            if entry and instance.points:
                LeaderboardEntry.objects.filter(pk=entry.pk).update(
                    score=F("score") + int(instance.points)
                )
    else:
        # handle updates: points changed and/or challenge changed
        prev_points = int(getattr(prev, "points", 0) or 0) if prev else 0
        new_points = int(instance.points or 0)

        prev_challenge = getattr(prev, "challenge", None) if prev else None
        new_challenge = instance.challenge

        # If challenge changed, subtract from old, add to new
        if prev_challenge and prev_challenge != new_challenge:
            old_entry = _ensure_entry(instance.user, prev_challenge)
            if old_entry and prev_points:
                LeaderboardEntry.objects.filter(pk=old_entry.pk).update(
                    score=F("score") - prev_points
                )
        if new_challenge:
            new_entry = _ensure_entry(instance.user, new_challenge)
            if new_entry:
                delta = (
                    new_points
                    if prev_challenge != new_challenge
                    else (new_points - prev_points)
                )
                if delta:
                    LeaderboardEntry.objects.filter(pk=new_entry.pk).update(
                        score=F("score") + int(delta)
                    )


@receiver(post_delete, sender=EcoAction)
def ecoaction_post_delete_update_leaderboard(sender, instance: EcoAction, **kwargs):
    # On deletion, subtract the points from that challenge entry
    if instance.challenge and instance.points:
        entry = _ensure_entry(instance.user, instance.challenge)
        if entry:
            LeaderboardEntry.objects.filter(pk=entry.pk).update(
                score=F("score") - int(instance.points)
            )
