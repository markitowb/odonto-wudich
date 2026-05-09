from django.urls import path

from .views import (
    AppointmentListCreateView,
    AppointmentRetrieveUpdateDestroyView,
)

app_name = "appointments"

urlpatterns = [
    path("", AppointmentListCreateView.as_view(), name="appointment_list_create"),
    path("<int:pk>/", AppointmentRetrieveUpdateDestroyView.as_view(), name="appointment_detail"),
]