from django.conf import settings
from django.db import models

from patients.models import Patient


class Appointment(models.Model):
    """
    Consulta / agendamento odontológico.
    """

    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Agendada"
        COMPLETED = "completed", "Concluída"
        CANCELED = "canceled", "Cancelada"

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="appointments",
        verbose_name="Paciente",
    )
    dentist = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="appointments_as_dentist",
        verbose_name="Dentista",
    )
    # horário da consulta
    start_datetime = models.DateTimeField("Início")
    end_datetime = models.DateTimeField("Fim")

    status = models.CharField(
        "Status",
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED,
    )

    notes = models.TextField("Observações", blank=True, null=True)

    created_at = models.DateTimeField("Criado em", auto_now_add=True)
    updated_at = models.DateTimeField("Atualizado em", auto_now=True)

    class Meta:
        verbose_name = "Consulta"
        verbose_name_plural = "Consultas"
        ordering = ["-start_datetime"]

    def __str__(self) -> str:
        return f"{self.patient.full_name} - {self.start_datetime:%d/%m/%Y %H:%M}"