from django.contrib import admin

from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ("full_name", "cpf", "phone_number", "created_at")
    search_fields = ("full_name", "cpf", "phone_number")
    list_filter = ("gender",)
    readonly_fields = ("created_at", "updated_at")