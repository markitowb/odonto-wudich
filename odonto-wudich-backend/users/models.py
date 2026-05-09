from django.contrib.auth.models import AbstractUser
from django.db import models

class Role(models.TextChoices):
    DENTIST = 'dentist', 'Dentista'
    SECRETARY = 'secretary', 'Secretária'

class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    document_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="RG ou outro documento",
    )
    cpf = models.CharField(
        max_length=14,
        blank=True,
        null=True,
        help_text="Formato 000.000.000-00",
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.DENTIST,
    )

# Necessário para evitar conflito com auth.User
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_set",  # <-- evita conflito
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_set",  # <-- evita conflito
        blank=True,
    )

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self) -> str:
        return self.username