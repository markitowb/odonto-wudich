from rest_framework import generics, permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegisterSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Endpoint de login. Retorna access e refresh token JWT.
    POST /api/users/token/
    Body: { "username": "...", "password": "..." }
    """

    serializer_class = CustomTokenObtainPairSerializer


class UserMeView(APIView):
    """
    Retorna os dados do usuário autenticado.
    GET /api/users/me/
    Requer: Authorization: Bearer <access_token>
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request) -> Response:
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request: Request) -> Response:
        """Permite ao usuário atualizar seus próprios dados."""
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,  # Permite atualização parcial (não precisa enviar todos os campos)
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRegisterView(generics.CreateAPIView):
    """
    Cria um novo usuário no sistema.
    POST /api/users/register/
    Restrito a usuários staff (admin da clínica).
    """

    queryset = CustomUser.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.IsAdminUser]  # Apenas admins criam usuários