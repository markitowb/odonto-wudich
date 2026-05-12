import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

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
    """
    Retorna um cliente de API já autenticado como dentista.
    Usa force_authenticate para evitar dependência do endpoint de login.
    """
    api_client.force_authenticate(user=dentist_user)
    return api_client


@pytest.fixture
def authenticated_secretary(api_client: APIClient, secretary_user: CustomUser) -> APIClient:
    """Retorna um cliente de API já autenticado como secretária."""
    api_client.force_authenticate(user=secretary_user)
    return api_client


# -------------------------------------------------------------------
# Testes
# -------------------------------------------------------------------

@pytest.mark.django_db
class TestPatientListCreateAPI:
    """Testes do endpoint GET/POST /api/patients/"""

    def test_unauthenticated_user_cannot_list_patients(
        self, api_client: APIClient
    ) -> None:
        """
        Verifica que usuário não autenticado recebe 401
        ao tentar listar pacientes.
        """
        url = reverse("patients:patient-list-create")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_dentist_can_list_patients(
        self, authenticated_dentist: APIClient, dentist_user: CustomUser
    ) -> None:
        """
        Verifica que dentista autenticado consegue listar pacientes (200).
        """
        url = reverse("patients:patient-list-create")
        response = authenticated_dentist.get(url)

        assert response.status_code == status.HTTP_200_OK

    def test_dentist_can_create_patient(
        self, authenticated_dentist: APIClient
    ) -> None:
        """
        Verifica que dentista autenticado consegue criar paciente (201).
        """
        url = reverse("patients:patient-list-create")
        data = make_patient_data()
        response = authenticated_dentist.post(url, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert Patient.objects.filter(cpf=data["cpf"]).exists()

    def test_secretary_can_create_patient(
        self, authenticated_secretary: APIClient
    ) -> None:
        """
        Verifica que secretária autenticada também consegue criar paciente.
        """
        url = reverse("patients:patient-list-create")
        data = make_patient_data()
        response = authenticated_secretary.post(url, data, format="json")

        assert response.status_code == status.HTTP_201_CREATED

    def test_unauthenticated_user_cannot_create_patient(
        self, api_client: APIClient
    ) -> None:
        """
        Verifica que usuário não autenticado recebe 401 ao tentar criar paciente.
        """
        url = reverse("patients:patient-list-create")
        data = make_patient_data()
        response = api_client.post(url, data, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestPatientRetrieveUpdateDestroyAPI:
    """Testes do endpoint GET/PUT/PATCH/DELETE /api/patients/{id}/"""

    def test_dentist_can_retrieve_patient(
        self, authenticated_dentist: APIClient, dentist_user: CustomUser
    ) -> None:
        """
        Verifica que dentista consegue ver detalhes de um paciente (200).
        """
        patient = Patient.objects.create(
            created_by=dentist_user,
            **make_patient_data(),
        )
        url = reverse("patients:patient-detail", kwargs={"pk": patient.pk})
        response = authenticated_dentist.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["cpf"] == patient.cpf

    def test_dentist_can_update_patient(
        self, authenticated_dentist: APIClient, dentist_user: CustomUser
    ) -> None:
        """
        Verifica que dentista consegue atualizar nome do paciente via PATCH (200).
        """
        patient = Patient.objects.create(
            created_by=dentist_user,
            **make_patient_data(),
        )
        url = reverse("patients:patient-detail", kwargs={"pk": patient.pk})
        response = authenticated_dentist.patch(
            url, {"full_name": "Nome Atualizado"}, format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        patient.refresh_from_db()
        assert patient.full_name == "Nome Atualizado"

    def test_dentist_can_delete_patient(
        self, authenticated_dentist: APIClient, dentist_user: CustomUser
    ) -> None:
        """
        Verifica que dentista consegue deletar um paciente (204).
        """
        patient = Patient.objects.create(
            created_by=dentist_user,
            **make_patient_data(),
        )
        url = reverse("patients:patient-detail", kwargs={"pk": patient.pk})
        response = authenticated_dentist.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Patient.objects.filter(pk=patient.pk).exists()