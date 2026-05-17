const API_BASE_URL = "http://127.0.0.1:8000/api";
const USERS_BASE_URL = `${API_BASE_URL}/users`;

/**
 * Faz uma requisição GET genérica para a API.
 */
export async function apiGet(path, token = null) {
  const url = `${API_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // ignora se não for JSON
    }

    const error = new Error(
      `Erro na requisição GET ${path}: ${response.status}`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

/**
 * Faz uma requisição POST genérica para a API.
 *
 * @param {string} path - Caminho do endpoint (ex: "/token/").
 * @param {object} body - Corpo JSON a ser enviado.
 * @param {string|null} token - JWT de autenticação (opcional).
 * @returns {Promise<any>} - Resposta em JSON.
 */
export async function apiPost(path, body, token = null) {
  const url = `${API_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // ignora se não for JSON
    }

    const error = new Error(
      `Erro na requisição POST ${path}: ${response.status}`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

/**
 * POST específico para endpoints de usuário (login, registro, etc.)
 */
export async function usersPost(path, body, token = null) {
  const url = `${USERS_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // ignora se não for JSON
    }

    const error = new Error(
      `Erro na requisição POST ${path}: ${response.status}`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}