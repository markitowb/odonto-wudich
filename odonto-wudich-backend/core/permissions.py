from typing import Iterable

from rest_framework import permissions
from rest_framework.request import Request


class IsAuthenticatedAndHasRole(permissions.BasePermission):
    """
    Permite acesso a usuários autenticados que possuam
    um dos papéis (roles) informados.

    Exemplo de uso:
        IsAuthenticatedAndHasRole(allowed_roles=["dentist", "secretary"])
    """

    def __init__(self, allowed_roles: Iterable[str] | None = None) -> None:
        super().__init__()
        self.allowed_roles = list(allowed_roles or [])

    def has_permission(self, request: Request, view) -> bool:
        user = request.user
        if not user or not user.is_authenticated:
            return False

        # staff sempre pode (admin da clínica)
        if getattr(user, "is_staff", False):
            return True

        user_role = getattr(user, "role", None)
        if not self.allowed_roles:
            # Se não foi passado nada, apenas exige autenticado.
            return True

        return user_role in self.allowed_roles