from datetime import datetime

from django.utils.dateparse import parse_datetime
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.request import Request

from core.permissions import IsAuthenticatedAndHasRole
from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/appointments/           -> lista consultas (auth)
    POST /api/appointments/           -> cria consulta (dentist/secretary)
    """

    serializer_class = AppointmentSerializer

    def get_queryset(self):
        queryset = Appointment.objects.all()

        patient_id = self.request.query_params.get("patient_id")
        dentist_id = self.request.query_params.get("dentist_id")
        date_str = self.request.query_params.get("date")

        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)

        if dentist_id:
            queryset = queryset.filter(dentist_id=dentist_id)

        if date_str:
            # filtro simples por data (ignora hora)
            try:
                date_obj = datetime.fromisoformat(date_str).date()
                queryset = queryset.filter(start_datetime__date=date_obj)
            except ValueError:
                pass

        return queryset
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            # GET, HEAD, OPTIONS
            return [permissions.IsAuthenticated()]
        # POST
        return [IsAuthenticatedAndHasRole(allowed_roles=["dentist", "secretary"])]

    def perform_create(self, serializer: AppointmentSerializer) -> None:
        serializer.save()


class AppointmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/appointments/<id>/    -> detalhe (qualquer autenticado)
    PUT    /api/appointments/<id>/    -> update completo (dentist/secretary)
    PATCH  /api/appointments/<id>/    -> update parcial (dentist/secretary)
    DELETE /api/appointments/<id>/    -> remover (dentist/secretary)
    """

    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        # PUT, PATCH, DELETE
        return [IsAuthenticatedAndHasRole(allowed_roles=["dentist", "secretary"])]
    
    def perform_update(self, serializer: AppointmentSerializer) -> None:
        """
        Se o campo `status` for alterado para 'completed',
        apenas dentista pode fazer isso.
        """
        user = self.request.user
        new_status = serializer.validated_data.get("status")

        if (
            new_status == Appointment.Status.COMPLETED
            and getattr(user, "role", None) != "dentist"
            and not user.is_staff
        ):
            raise PermissionDenied("Somente dentista pode marcar consulta como concluída.")

        serializer.save()