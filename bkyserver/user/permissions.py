from rest_framework.permissions import BasePermission

class IsAdminProfile(BasePermission):
    """
    Allows access only to users who have an AdminProfile attached to their account.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and hasattr(request.user, 'admin_profile'))
