"""
Configuração do Django Admin para o modelo User customizado.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin customizado para o User da clínica.
    Substitui os campos padrão pelo nosso modelo.
    """

    # Colunas visíveis na listagem
    list_display = [
        "email",
        "full_name",
        "role",
        "is_active",
        "is_staff",
        "created_at",
    ]

    # Filtros laterais
    list_filter = ["role", "is_active", "is_staff"]

    # Campo de busca
    search_fields = ["email", "full_name", "phone"]

    # Ordenação padrão
    ordering = ["full_name"]

    # Campos ao EDITAR um usuário existente
    fieldsets = (
        (None, {
            "fields": ("email", "password")
        }),
        (_("Informações pessoais"), {
            "fields": ("full_name", "phone", "role")
        }),
        (_("Permissões"), {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        (_("Datas"), {
            "fields": ("created_at",)
        }),
    )

    # Campos ao CRIAR um novo usuário pelo admin
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "full_name",
                "phone",
                "role",
                "password1",
                "password2",
            ),
        }),
    )

    # created_at não pode ser editado (gerado automaticamente)
    readonly_fields = ["created_at"]