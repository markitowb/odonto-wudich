from django.urls import path

from .views import PatientListCreateView, PatientRetrieveUpdateDestroyView

app_name = "patients"

urlpatterns = [
    path(
        "", 
        PatientListCreateView.as_view(), 
        name="patient-list-create"
    ),
    path(
        "<int:pk>/", 
        PatientRetrieveUpdateDestroyView.as_view(), 
        name="patient-detail"
    ),
]