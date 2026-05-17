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
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserMeView(APIView):
    """
    Retorna os dados do usuário autenticado.
    GET  /api/users/me/
    PATCH /api/users/me/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Request) -> Response:
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request: Request) -> Response:
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRegisterView(generics.CreateAPIView):
    """
    Cria um novo usuário no sistema.
    POST /api/users/register/
    Restrito a admins.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.IsAdminUser]


class DentistListView(generics.ListAPIView):
    """
    Lista todos os usuários com role 'dentist'.
    GET /api/users/dentists/
    Requer autenticação.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CustomUser.objects.filter(role="dentist")