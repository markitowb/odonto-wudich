"""
Model de usuário customizado da clínica.
Substitui completamente o User padrão do Django.

Documentação oficial:
https://docs.djangoproject.com/en/5.1/topics/auth/customizing/
"""

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UserManager


class UserRole(models.TextChoices):
    """
    Papéis disponíveis no sistema da clínica.
    TextChoices gera automaticamente as constantes e validações.
    """
    ADMIN        = "ADMIN",        "Administrador"
    DENTIST      = "DENTIST",      "Dentista"
    RECEPTIONIST = "RECEPTIONIST", "Recepcionista"
    PATIENT      = "PATIENT",      "Paciente"


class User(AbstractBaseUser, PermissionsMixin):
    """
    Usuário customizado da clínica odontológica.

    Diferenças do User padrão do Django:
    - Login por email (não por username)
    - Campo full_name no lugar de first_name + last_name
    - Campo role para controle de acesso por perfil
    - Campo phone para contato
    - created_at e updated_at para auditoria
    """

    email = models.EmailField(
        unique=True,
        verbose_name="E-mail",
        help_text="Usado como identificador de login."
    )
    full_name = models.CharField(
        max_length=255,
        verbose_name="Nome completo"
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Telefone"
    )
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.PATIENT,
        verbose_name="Perfil"
    )

    # Campos de controle — necessários para o Django Admin funcionar
    is_active = models.BooleanField(
        default=True,
        verbose_name="Ativo"
    )
    is_staff = models.BooleanField(
        default=False,
        verbose_name="Acesso ao admin"
    )

    # Auditoria — sempre útil para saber quando o registro foi criado
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    # Manager customizado — define como criar usuários
    objects = UserManager()

    # Define email como campo de login (substitui username)
    USERNAME_FIELD = "email"

    # Campos obrigatórios ao criar superusuário pelo terminal
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
        ordering = ["full_name"]

    def __str__(self) -> str:
        return f"{self.full_name} ({self.email})"

    @property
    def is_dentist(self) -> bool:
        """Verifica se o usuário é dentista."""
        return self.role == UserRole.DENTIST

    @property
    def is_receptionist(self) -> bool:
        """Verifica se o usuário é recepcionista."""
        return self.role == UserRole.RECEPTIONIST

    @property
    def is_patient(self) -> bool:
        """Verifica se o usuário é paciente."""
        return self.role == UserRole.PATIENT