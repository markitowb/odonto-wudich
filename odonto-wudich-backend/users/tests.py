import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from users.models import CustomUser


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture
def admin_user(db) -> CustomUser:
    return CustomUser.objects.create_user(
        username="admin_test",
        password="admin123",
        role="dentist",
        is_staff=True,
        is_superuser=True,
    )


@pytest.fixture
def normal_user(db) -> CustomUser:
    return CustomUser.objects.create_user(
        username="user_test",
        password="user123",
        role="assistant",  # ou outro valor válido que você usa
    )


@pytest.fixture
def admin_client(api_client: APIClient, admin_user: CustomUser) -> APIClient:
    api_client.force_authenticate(user=admin_user)
    return api_client


@pytest.fixture
def authenticated_client(api_client: APIClient, normal_user: CustomUser) -> APIClient:
    api_client.force_authenticate(user=normal_user)
    return api_client


def test_login_returns_access_and_refresh_tokens(api_client: APIClient, admin_user: CustomUser):
    url = reverse("users:token_obtain_pair")
    payload = {"username": "admin_test", "password": "admin123"}

    response = api_client.post(url, payload, format="json")

    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data


def test_me_returns_current_user_data(authenticated_client: APIClient, normal_user: CustomUser):
    url = reverse("users:user_me")

    response = authenticated_client.get(url)

    assert response.status_code == 200
    assert response.data["id"] == normal_user.id
    assert response.data["username"] == normal_user.username


def test_me_requires_authentication(api_client: APIClient):
    url = reverse("users:user_me")

    response = api_client.get(url)

    assert response.status_code == 401


def test_register_creates_user_only_for_admin(admin_client: APIClient):
    url = reverse("users:user_register")
    payload = {
        "username": "new_user",
        "password": "Senha@123",
        "password_confirm": "Senha@123",
        "role": "dentist",
    }

    response = admin_client.post(url, payload, format="json")

    assert response.status_code == 201
    assert response.data["username"] == "new_user"
    assert CustomUser.objects.filter(username="new_user").exists()


def test_register_forbidden_for_non_admin(authenticated_client: APIClient):
    url = reverse("users:user_register")
    payload = {
        "username": "another_user",
        "password": "Senha@123",
        "password_confirm": "Senha@123",
        "role": "assistant",
    }

    response = authenticated_client.post(url, payload, format="json")

    assert response.status_code == 403


def test_dentists_list_returns_only_dentists(admin_client: APIClient, normal_user: CustomUser):
    # admin_user tem role="dentist" na fixture
    dentist2 = CustomUser.objects.create_user(
        username="dentist2",
        password="senha123",
        role="dentist",
    )

    url = reverse("users:dentist_list")
    response = admin_client.get(url)

    assert response.status_code == 200
    usernames = [item["username"] for item in response.data]

    assert "admin_test" in usernames
    assert "dentist2" in usernames
    assert "user_test" not in usernames  # não deve listar usuário normal