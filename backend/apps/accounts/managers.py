"""
Manager customizado para o modelo User.
Controla como usuários são criados no sistema.
"""

from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    """
    Manager que usa email como identificador único
    no lugar do username padrão do Django.
    """

    def create_user(
        self,
        email: str,
        password: str,
        **extra_fields
    ) -> "User":  # type: ignore
        """
        Cria e salva um usuário comum.

        Args:
            email: E-mail do usuário (identificador de login).
            password: Senha em texto puro (será hasheada automaticamente).
            **extra_fields: Campos adicionais do modelo User.

        Raises:
            ValueError: Se o e-mail não for fornecido.
        """
        if not email:
            raise ValueError("O e-mail é obrigatório.")

        # Normaliza o email: minúsculas no domínio
        # ex: Marcus@GMAIL.COM → Marcus@gmail.com
        email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)

        # ✅ SEGURANÇA: set_password faz o hash da senha automaticamente
        # NUNCA faça: user.password = password (texto puro)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(
        self,
        email: str,
        password: str,
        **extra_fields
    ) -> "User":  # type: ignore
        """
        Cria e salva um superusuário (acesso total ao sistema).

        Usado pelo comando: python manage.py createsuperuser
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superusuário deve ter is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superusuário deve ter is_superuser=True.")

        return self.create_user(email, password, **extra_fields)