from datetime import datetime, timedelta
from django.utils import timezone


def make_appointment_data(
    patient_id: int,
    dentist_id: int,
    overrides: dict | None = None,
) -> dict:
    """
    Gera um dicionário com dados válidos de consulta.

    Args:
        patient_id: ID do paciente já criado no banco.
        dentist_id: ID do dentista responsável pela consulta.
        overrides: Campos que você quer sobrescrever.

    Returns:
        Dicionário pronto para enviar ao endpoint POST /api/appointments/.
    """
    start = timezone.now() + timedelta(days=1)
    end = start + timedelta(hours=1)

    data = {
        "patient_id": patient_id,
        "dentist_id": dentist_id,
        "start_datetime": start.strftime("%Y-%m-%dT%H:%M:%S"),
        "end_datetime": end.strftime("%Y-%m-%dT%H:%M:%S"),
        "status": "scheduled",
        "notes": "Consulta gerada para teste automatizado.",
    }

    if overrides:
        data.update(overrides)

    return data