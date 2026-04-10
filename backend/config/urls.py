"""
Configuração central de URLs do projeto.
Documentação: https://docs.djangoproject.com/en/5.1/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)


urlpatterns = [
    # Admin do Django
    path("admin/", admin.site.urls),

    # Documentação automática da API (Swagger)
    # Acesse: http://localhost:8000/api/docs/
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),

    # ↓ As rotas dos apps serão adicionadas aqui conforme criamos
    # path("api/v1/patients/", include("apps.patients.urls")),
]