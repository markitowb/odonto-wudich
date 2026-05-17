const API_BASE_URL = "http://127.0.0.1:8000/api";
const USERS_BASE_URL = `${API_BASE_URL}/users`;

export async function apiGet(path, token = null) {
  const url = `${API_BASE_URL}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const error = new Error(`Erro GET ${path}: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function apiPost(path, body, token = null) {
  const url = `${API_BASE_URL}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = new Error(`Erro POST ${path}: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function apiPatch(path, body, token = null) {
  const url = `${API_BASE_URL}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = new Error(`Erro PATCH ${path}: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function apiDelete(path, token = null) {
  const url = `${API_BASE_URL}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers,
  });

  // DELETE bem-sucedido retorna 204 (sem corpo)
  if (!response.ok) {
    const error = new Error(`Erro DELETE ${path}: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  // 204 No Content não tem corpo para parsear
  return null;
}

export async function usersPost(path, body, token = null) {
  const url = `${USERS_BASE_URL}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = new Error(`Erro POST ${path}: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}