from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import CustomTokenObtainPairView, UserMeView, UserRegisterView

app_name = "users"

urlpatterns = [
    # Autenticação JWT
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Usuário autenticado
    path("me/", UserMeView.as_view(), name="user_me"),

    # Registro (apenas admin)
    path("register/", UserRegisterView.as_view(), name="user_register"),
]