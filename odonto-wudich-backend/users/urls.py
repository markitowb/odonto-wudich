from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    DentistListView,
    UserMeView,
    UserRegisterView,
)

app_name = "users"

urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", UserMeView.as_view(), name="user_me"),
    path("register/", UserRegisterView.as_view(), name="user_register"),
    path("dentists/", DentistListView.as_view(), name="dentist_list"),
]