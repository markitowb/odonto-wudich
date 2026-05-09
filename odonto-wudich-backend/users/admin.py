from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Campos extras exibidos no admin
    fieldsets = UserAdmin.fieldsets + (
        ("Informações adicionais", {
            "fields": (
                "date_of_birth",
                "document_number",
                "cpf",
                "phone_number",
                "address",
                "role",
            )
        }),
    )

    list_display = ("username", "email", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active")
