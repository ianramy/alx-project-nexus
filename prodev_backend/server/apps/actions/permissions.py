# server/apps/actions/permissions.py

from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user and (
            request.user.is_staff or obj.user_id == request.user.id
        )
