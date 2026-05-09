from rest_framework import serializers

from patients.models import Patient
from users.models import CustomUser

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    """
    Serializer principal para consultas.
    Usa IDs de patient e dentist na escrita,
    e dados resumidos na leitura.
    """

    patient_id = serializers.PrimaryKeyRelatedField(
        source="patient",
        queryset=Patient.objects.all(),
        write_only=True,
    )
    dentist_id = serializers.PrimaryKeyRelatedField(
        source="dentist",
        queryset=CustomUser.objects.filter(role="dentist"),
        write_only=True,
    )

    patient = serializers.CharField(
        source="patient.full_name",
        read_only=True,
    )
    dentist = serializers.CharField(
        source="dentist.username",
        read_only=True,
    )

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient",
            "patient_id",
            "dentist",
            "dentist_id",
            "start_datetime",
            "end_datetime",
            "status",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("created_at", "updated_at")

    def validate(self, attrs):
        """
        Regras básicas:
        - end_datetime deve ser depois de start_datetime.
        """
        start = attrs.get("start_datetime") or getattr(self.instance, "start_datetime", None)
        end = attrs.get("end_datetime") or getattr(self.instance, "end_datetime", None)

        if start and end and end <= start:
            raise serializers.ValidationError(
                {"end_datetime": "O término deve ser depois do início."}
            )

        return attrs