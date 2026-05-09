from rest_framework import generics, permissions
from rest_framework.request import Request

from core.permissions import IsAuthenticatedAndHasRole
from .models import Patient
from .serializers import PatientSerializer


class PatientListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/patients/      -> lista pacientes (auth)
    POST /api/patients/      -> cria paciente (staff)
    """

    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            # GET, HEAD, OPTIONS
            return [permissions.IsAuthenticated()]
        # POST
        return [IsAuthenticatedAndHasRole(allowed_roles=["dentist", "secretary"])]

    def perform_create(self, serializer: PatientSerializer) -> None:
        serializer.save(created_by=self.request.user)


class PatientRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/patients/<id>/ -> detalhe (qualquer autenticado)
    PUT    /api/patients/<id>/ -> update completo (dentist/secretary)
    PATCH  /api/patients/<id>/ -> update parcial (dentist/secretary)
    DELETE /api/patients/<id>/ -> remover (dentist/secretary)
    """

    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        # PUT, PATCH, DELETE
        return [IsAuthenticatedAndHasRole(allowed_roles=["dentist", "secretary"])]