import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from appointments.models import Appointment
from appointments.tests.factories import make_appointment_data
from patients.models import Patient
from patients.tests.factories import make_patient_data
from users.models import CustomUser


# -------------------------------------------------------------------
# Fixtures reutilizáveis
# -------------------------------------------------------------------

@pytest.fixture
def api_client() -> APIClient:
    """Retorna um cliente de API sem autenticação."""
    return APIClient()


@pytest.fixture
def dentist_user(db) -> CustomUser:
    """Cria e retorna um usuário dentista."""
    return CustomUser.objects.create_user(
        username="dentist_test",
        password="senha_segura_123",
        role="dentist",
    )


@pytest.fixture
def secretary_user(db) -> CustomUser:
    """Cria e retorna um usuário secretária."""
    return CustomUser.objects.create_user(
        username="secretary_test",
        password="senha_segura_123",
        role="secretary",
    )


@pytest.fixture
def authenticated_dentist(api_client: APIClient, dentist_user: CustomUser) -> APIClient:
    """Retorna cliente autenticado como dentista."""
    api_client.force_authenticate(user=dentist_user)
    return api_client


@pytest.fixture
def authenticated_secretary(api_client: APIClient, secretary_user: CustomUser) -> APIClient:
    """Retorna cliente autenticado como secretária."""
    api_client.force_authenticate(user=secretary_user)
    return api_client


@pytest.fixture
def patient(db, dentist_user: CustomUser) -> Patient:
    """
    Cria e retorna um paciente no banco.
    Depende do fixture dentist_user para preencher o campo created_by.
    """
    return Patient.objects.create(
        created_by=dentist_user,
        **make_patient_data(),
    )


@pytest.fixture
def appointment(db, patient: Patient, dentist_user: CustomUser) -> Appointment:
    """
    Cria e retorna uma consulta no banco com status 'scheduled'.
    """
    from django.utils import timezone
    from datetime import timedelta

    start = timezone.now() + timedelta(days=1)
    end = start + timedelta(hours=1)

    return Appointment.objects.create(
        patient=patient,
        dentist=dentist_user,
        start_datetime=start,
        end_datetime=end,
        status="scheduled",
        notes="Consulta criada para teste automatizado.",
    )


# -------------------------------------------------------------------
# Testes de criação de consulta
# -------------------------------------------------------------------

@pytest.mark.django_db
class TestAppointmentCreateAPI:
    """Testes do endpoint POST /api/appointments/"""

    def test_unauthenticated_user_cannot_create_appointment(
        self, api_client: APIClient, patient: Patient, dentist_user: CustomUser
    ) -> None:
        """
        Usuário não autenticado deve receber 401 ao tentar criar consulta.
        """
        url = reverse("appointments:appointment-list-create")
        data = make_appointment_data(
            patient_id=patient.pk,
            dentist_id=dentist_user.pk,
        )
        response = api_client.post(url, data, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_dentist_can_create_appointment(
        self,
        authenticated_dentist: APIClient,
        patient: Patient,
        dentist_user: CustomUser,
    ) -> None:
        """
        Dentista autenticado deve conseguir criar uma consulta (201).
        """
        url = reverse("appointments:appointment-list-create")
        data = make_appointment_data(
            patient_id=patient.pk,
            dentist_id=dentist_user.pk,
        )
        response = authenticated_dentist.post(url, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert Appointment.objects.filter(patient=patient).exists()

    def test_secretary_can_create_appointment(
        self,
        authenticated_secretary: APIClient,
        patient: Patient,
        dentist_user: CustomUser,
    ) -> None:
        """
        Secretária autenticada também deve conseguir criar consulta (201).
        """
        url = reverse("appointments:appointment-list-create")
        data = make_appointment_data(
            patient_id=patient.pk,
            dentist_id=dentist_user.pk,
        )
        response = authenticated_secretary.post(url, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED


# -------------------------------------------------------------------
# Testes de listagem e detalhe
# -------------------------------------------------------------------

@pytest.mark.django_db
class TestAppointmentListRetrieveAPI:
    """Testes dos endpoints GET /api/appointments/ e GET /api/appointments/{id}/"""

    def test_unauthenticated_user_cannot_list_appointments(
        self, api_client: APIClient
    ) -> None:
        """
        Usuário não autenticado recebe 401 ao listar consultas.
        """
        url = reverse("appointments:appointment-list-create")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_dentist_can_list_appointments(
        self, authenticated_dentist: APIClient
    ) -> None:
        """
        Dentista autenticado consegue listar consultas (200).
        """
        url = reverse("appointments:appointment-list-create")
        response = authenticated_dentist.get(url)

        assert response.status_code == status.HTTP_200_OK

    def test_dentist_can_retrieve_appointment(
        self, authenticated_dentist: APIClient, appointment: Appointment
    ) -> None:
        """
        Dentista consegue ver detalhes de uma consulta específica (200).
        """
        url = reverse(
            "appointments:appointment-detail",
            kwargs={"pk": appointment.pk},
        )
        response = authenticated_dentist.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "scheduled"


# -------------------------------------------------------------------
# Testes de permissões por role (regra de negócio central)
# -------------------------------------------------------------------

@pytest.mark.django_db
class TestAppointmentPermissions:
    """
    Testes das regras de permissão por role.

    Regra de negócio:
    - Dentista pode marcar consulta como 'completed'.
    - Secretária NÃO pode marcar consulta como 'completed'.
    - Qualquer autenticado pode marcar como 'canceled'.
    """

    def test_dentist_can_mark_appointment_as_completed(
        self, authenticated_dentist: APIClient, appointment: Appointment
    ) -> None:
        """
        Dentista deve conseguir mudar status para 'completed' via PATCH (200).
        """
        url = reverse(
            "appointments:appointment-detail",
            kwargs={"pk": appointment.pk},
        )
        response = authenticated_dentist.patch(
            url, {"status": "completed"}, format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        appointment.refresh_from_db()
        assert appointment.status == "completed"

    def test_secretary_cannot_mark_appointment_as_completed(
        self, authenticated_secretary: APIClient, appointment: Appointment
    ) -> None:
        """
        Secretária NÃO deve conseguir marcar consulta como 'completed'.
        Deve receber 403 Forbidden.

        Essa é a regra de negócio mais importante do sistema:
        só dentista conclui consulta.
        """
        url = reverse(
            "appointments:appointment-detail",
            kwargs={"pk": appointment.pk},
        )
        response = authenticated_secretary.patch(
            url, {"status": "completed"}, format="json"
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN
        appointment.refresh_from_db()
        assert appointment.status == "scheduled"  # não mudou

    def test_secretary_can_cancel_appointment(
        self, authenticated_secretary: APIClient, appointment: Appointment
    ) -> None:
        """
        Secretária deve conseguir cancelar uma consulta (200).
        Cancelamento é permitido para qualquer usuário autenticado.
        """
        url = reverse(
            "appointments:appointment-detail",
            kwargs={"pk": appointment.pk},
        )
        response = authenticated_secretary.patch(
            url, {"status": "canceled"}, format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        appointment.refresh_from_db()
        assert appointment.status == "canceled"

    def test_dentist_can_cancel_appointment(
        self, authenticated_dentist: APIClient, appointment: Appointment
    ) -> None:
        """
        Dentista também deve conseguir cancelar uma consulta (200).
        """
        url = reverse(
            "appointments:appointment-detail",
            kwargs={"pk": appointment.pk},
        )
        response = authenticated_dentist.patch(
            url, {"status": "canceled"}, format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        appointment.refresh_from_db()
        assert appointment.status == "canceled"

    def test_unauthenticated_user_cannot_update_appointment(
        self, api_client: APIClient, appointment: Appointment
    ) -> None:
        """
        Usuário não autenticado recebe 401 ao tentar atualizar consulta.
        """
        url = reverse(
            "appointments:appointment-detail",
            kwargs={"pk": appointment.pk},
        )
        response = api_client.patch(
            url, {"status": "canceled"}, format="json"
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED