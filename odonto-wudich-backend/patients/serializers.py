from rest_framework import serializers
from .models import Patient
from .validators import validate_cpf


class PatientSerializer(serializers.ModelSerializer):
    """
    Usado para listar, detalhar, criar e atualizar pacientes.
    """
    cpf = serializers.CharField(
        required=False,
        allow_blank=True,
        validators=[validate_cpf],
    )

    class Meta:
        model = Patient
        fields = [
            "id",
            "full_name",
            "email",
            "phone_number",
            "cpf",
            "date_of_birth",
            "gender",
            "address",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("created_at", "updated_at")