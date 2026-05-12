import pytest
from django.db import IntegrityError

from patients.models import Patient
from patients.tests.factories import make_patient_data
from users.models import CustomUser


@pytest.fixture
def dentist_user(db) -> CustomUser:
    """
    Cria e retorna um usuário com role=dentist para usar nos testes.
    O fixture `db` do pytest-django garante acesso ao banco de dados.
    """
    return CustomUser.objects.create_user(
        username="dentist_test",
        password="senha_segura_123",
        role="dentist",
    )


@pytest.mark.django_db
class TestPatientModel:
    """Testes unitários do modelo Patient."""

    def test_create_patient_successfully(self, dentist_user: CustomUser) -> None:
        """
        Verifica que um paciente é criado corretamente
        com todos os campos obrigatórios preenchidos.
        """
        data = make_patient_data()
        patient = Patient.objects.create(
            created_by=dentist_user,
            **data,
        )

        assert patient.pk is not None
        assert patient.full_name == data["full_name"]
        assert patient.cpf == data["cpf"]
        assert str(patient) == patient.full_name

    def test_cpf_must_be_unique(self, dentist_user: CustomUser) -> None:
        """
        Verifica que o banco rejeita dois pacientes com o mesmo CPF.
        O CPF é um campo único no modelo.
        """
        data = make_patient_data()

        # cria o primeiro paciente
        Patient.objects.create(created_by=dentist_user, **data)

        # tenta criar um segundo com o mesmo CPF
        with pytest.raises(IntegrityError):
            Patient.objects.create(created_by=dentist_user, **data)

    def test_patient_str_returns_full_name(self, dentist_user: CustomUser) -> None:
        """
        Verifica que o __str__ do modelo retorna o nome completo do paciente.
        """
        data = make_patient_data({"full_name": "Ana Paula Souza"})
        patient = Patient.objects.create(
            created_by=dentist_user,
            **data,
        )

        assert str(patient) == "Ana Paula Souza"