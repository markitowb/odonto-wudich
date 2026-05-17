const API_BASE_URL = "http://127.0.0.1:8000/api";
const USERS_BASE_URL = `${API_BASE_URL}/users`;

// ─────────────────────────────────────────────
// Funções auxiliares de token
// ─────────────────────────────────────────────

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function saveAccessToken(token) {
  localStorage.setItem("accessToken", token);
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// ─────────────────────────────────────────────
// Refresh Token: tenta renovar o accessToken
// ─────────────────────────────────────────────

async function tryRefreshAccessToken() {
  const refreshToken = getRefreshToken();

  // Se não tem refreshToken, não tem como renovar
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${USERS_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    saveAccessToken(data.access);
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// Função base: todas as requisições passam aqui
// ─────────────────────────────────────────────

async function apiFetch(path, options = {}, isRetry = false) {
  const url = `${API_BASE_URL}${path}`;

  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  // Se recebeu 401 e ainda não tentamos o refresh
  if (response.status === 401 && !isRetry) {
    const refreshed = await tryRefreshAccessToken();

    if (refreshed) {
      // Refaz a requisição original com o novo accessToken
      return apiFetch(path, options, true);
    }

    // Refresh falhou: limpa os tokens e redireciona para login
    clearTokens();
    window.location.href = "/login";

    const error = new Error("Sessão expirada. Faça login novamente.");
    error.status = 401;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`Erro ${response.status} em ${path}`);
    error.status = response.status;
    throw error;
  }

  // DELETE retorna 204 (sem corpo)
  if (response.status === 204) return null;

  return response.json();
}

// ─────────────────────────────────────────────
// Funções públicas da API
// ─────────────────────────────────────────────

export async function apiGet(path) {
  return apiFetch(path, { method: "GET" });
}

export async function apiPost(path, body) {
  return apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPatch(path, body) {
  return apiFetch(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function apiDelete(path) {
  return apiFetch(path, { method: "DELETE" });
}

// ─────────────────────────────────────────────
// Exclusivo para login (não usa Bearer token)
// ─────────────────────────────────────────────

export async function usersPost(path, body) {
  const url = `${USERS_BASE_URL}${path}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = new Error(`Erro POST ${path}: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}