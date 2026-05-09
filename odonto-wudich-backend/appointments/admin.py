from django.contrib import admin

from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("patient", "dentist", "start_datetime", "status", "created_at")
    list_filter = ("status", "dentist")
    search_fields = ("patient__full_name", "dentist__username", "dentist__email")
    readonly_fields = ("created_at", "updated_at")