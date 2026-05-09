from django.conf import settings
from django.db import models


class Patient(models.Model):
    """
    Paciente da clínica odontológica.
    """

    class Gender(models.TextChoices):
        MALE = "M", "Masculino"
        FEMALE = "F", "Feminino"
        OTHER = "O", "Outro"

    full_name = models.CharField("Nome completo", max_length=255)
    email = models.EmailField("E-mail", max_length=255, blank=True, null=True)
    phone_number = models.CharField("Telefone", max_length=20, blank=True, null=True)
    cpf = models.CharField("CPF", max_length=14, unique=True)
    date_of_birth = models.DateField("Data de nascimento", blank=True, null=True)
    gender = models.CharField(
        "Gênero",
        max_length=1,
        choices=Gender.choices,
        blank=True,
        null=True,
    )
    address = models.CharField("Endereço", max_length=255, blank=True, null=True)
    notes = models.TextField("Observações", blank=True, null=True)

    # Quem cadastrou o paciente
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="patients_created",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField("Criado em", auto_now_add=True)
    updated_at = models.DateTimeField("Atualizado em", auto_now=True)

    class Meta:
        verbose_name = "Paciente"
        verbose_name_plural = "Pacientes"
        ordering = ["full_name"]

    def __str__(self) -> str:
        return self.full_name
