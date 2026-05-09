from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer customizado para o token JWT.
    Adiciona campos extras no payload do token (role, email).
    Isso permite que o frontend saiba o papel do usuário
    sem precisar fazer uma requisição extra à API.
    """

    @classmethod
    def get_token(cls, user: CustomUser):
        token = super().get_token(user)

        # Campos extras no payload do JWT
        token["email"] = user.email
        token["role"] = user.role

        return token


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para leitura dos dados do usuário autenticado.
    Usado no endpoint /api/users/me/
    """

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "phone_number",
            "cpf",
            "date_of_birth",
            "address",
        ]
        # Todos os campos são somente leitura neste serializer
        read_only_fields = fields


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para criação de novo usuário.
    Usado no endpoint /api/users/register/
    Apenas usuários staff (admin) poderão acessar esse endpoint.
    """

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],  # Usa os validadores do settings.py
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
    )

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "password",
            "password_confirm",
            "first_name",
            "last_name",
            "role",
            "phone_number",
            "cpf",
            "date_of_birth",
            "address",
        ]

    def validate(self, attrs: dict) -> dict:
        """Verifica se as senhas coincidem."""
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password": "As senhas não coincidem."}
            )
        return attrs

    def create(self, validated_data: dict) -> CustomUser:
        """
        Remove password_confirm antes de criar o usuário.
        Usa create_user para garantir que a senha seja hasheada corretamente.
        NUNCA salvar senha em texto puro.
        """
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        user = CustomUser(**validated_data)
        user.set_password(password)  # Faz o hash da senha (bcrypt via Django)
        user.save()

        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para o usuário atualizar seus próprios dados.
    Não permite alterar username, role ou senha por aqui.
    """

    class Meta:
        model = CustomUser
        fields = [
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "cpf",
            "date_of_birth",
            "address",
        ]