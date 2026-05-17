# Odonto Wudich – Sistema Odontológico (Django + React)

Aplicação Full Stack para gestão de clínica odontológica, com:

- Cadastro de pacientes
- Agendamentos de consultas
- Autenticação com JWT (access + refresh token)
- Frontend em React consumindo API REST em Django REST Framework

> Projeto construído com foco em boas práticas (Clean Code, segurança) para uso em portfólio.

---

## Arquitetura

Monorepo com backend e frontend separados:

```bash
odonto-wudich/
├── odonto-wudich-backend/   # API REST (Django + DRF + JWT)
└── odonto-wudich-frontend/  # SPA em React
```

---

## Tecnologias principais

**Backend**

- Python 3.12
- Django 5
- Django REST Framework
- django-rest-framework-simplejwt (JWT)
- drf-spectacular (documentação OpenAPI: Swagger / Redoc)
- SQLite (ambiente de desenvolvimento)

**Frontend**

- React (Create React App)
- React Router DOM
- Fetch API

---

## Como rodar o backend (API)

Na raiz do projeto:

```bash
cd odonto-wudich-backend
```

### 1. Criar e ativar virtualenv

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# ou
# source venv/bin/activate  # Linux/Mac
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Aplicar migrações

```bash
python manage.py migrate
```

### 4. Criar superusuário (admin da clínica)

```bash
python manage.py createsuperuser
```

Siga as instruções do terminal para definir usuário e senha.

### 5. Rodar o servidor

```bash
python manage.py runserver
```

A API estará acessível em:

- `http://127.0.0.1:8000/api/`

---

## Documentação da API

A documentação é gerada automaticamente com **drf-spectacular**:

- Swagger UI:  
  `http://127.0.0.1:8000/api/schema/swagger-ui/`

- Redoc:  
  `http://127.0.0.1:8000/api/schema/redoc/`

---

## Autenticação (JWT)

A autenticação é baseada em **JWT** com access e refresh token.

### Login (obter tokens)

```http
POST /api/users/token/
Content-Type: application/json

{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```

Resposta:

```json
{
  "access": "<access_token>",
  "refresh": "<refresh_token>"
}
```

### Refresh do access token

```http
POST /api/users/token/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}
```

Resposta:

```json
{
  "access": "<novo_access_token>"
}
```

### Usuário logado

```http
GET /api/users/me/
Authorization: Bearer <access_token>
```

---

## Pacientes – Endpoints principais

Base: `/api/patients/`

- `GET /api/patients/`  
  Lista pacientes.

- `POST /api/patients/`  
  Cria paciente.

- `GET /api/patients/<id>/`  
  Detalhe de um paciente.

- `PATCH /api/patients/<id>/`  
  Atualiza parcialmente.

- `DELETE /api/patients/<id>/`  
  Remove paciente.

Exemplo de JSON de paciente:

```json
{
  "id": 1,
  "full_name": "João da Silva",
  "email": "joao@exemplo.com",
  "phone_number": "51999999999",
  "cpf": "000.000.000-00",
  "date_of_birth": "1990-01-01",
  "gender": "M",
  "address": "Rua Teste, 123",
  "notes": "Paciente teste",
  "created_at": "2026-05-06T16:54:29.794773Z",
  "updated_at": "2026-05-06T16:54:29.794773Z"
}
```

---

## Agendamentos – Endpoints principais

Base: `/api/appointments/`

- `GET /api/appointments/`  
  Lista consultas. Aceita filtros:

  - `?patient_id=<id>`
  - `?dentist_id=<id>`
  - `?date=YYYY-MM-DD`

- `POST /api/appointments/`  
  Cria consulta.

- `GET /api/appointments/<id>/`  
  Detalhe da consulta.

- `PATCH /api/appointments/<id>/`  
  Atualiza consulta (inclui mudança de status).

- `DELETE /api/appointments/<id>/`  
  Remove consulta.

Exemplo de JSON de agendamento:

```json
{
  "id": 3,
  "patient": "João da Silva",
  "dentist": "admin",
  "start_datetime": "2026-05-20T10:00:00Z",
  "end_datetime": "2026-05-20T11:00:00Z",
  "status": "scheduled",
  "notes": "Consulta de rotina",
  "created_at": "2026-05-17T19:08:05.574428Z",
  "updated_at": "2026-05-17T19:08:05.574428Z"
}
```

Status possíveis:

- `scheduled` – Agendada
- `completed` – Concluída
- `canceled` – Cancelada

Regras de permissão implementadas:

- Apenas dentistas podem marcar consulta como `completed`.
- Apenas usuários autenticados podem listar.
- Criação/edição/remoção restrita a papéis específicos (ex.: dentista/secretária).

---

## Como rodar o frontend (React)

Na raiz do projeto:

```bash
cd odonto-wudich-frontend
```

### 1. Instalar dependências

```bash
npm install
# ou
npm.cmd install  # Windows (se preferir)
```

### 2. Rodar o frontend

```bash
npm start
# ou
npm.cmd start
```

O app React ficará disponível em:

- `http://localhost:3000/`

> Certifique-se de que o backend está rodando em `http://127.0.0.1:8000/`, pois o frontend usa essa URL como `API_BASE_URL`.

---

## Fluxo do frontend

### Login

- Tela de login em `/login`
- Autenticação com `username` + `password`
- Em caso de sucesso:
  - `accessToken` e `refreshToken` são salvos no `localStorage`
  - Usuário é redirecionado para `/home`

### Rotas privadas

Implementadas com `React Router` + componente `PrivateRoute`:

- `/home` – Dashboard inicial
- `/patients` – Lista de pacientes
- `/patients/new` – Novo paciente
- `/patients/:id/edit` – Editar paciente
- `/appointments` – Lista de agendamentos
- `/appointments/new` – Novo agendamento
- `/appointments/:id/edit` – Editar agendamento

Se não houver `accessToken` válido, o usuário é redirecionado para `/login`.

### Refresh automático do token (frontend)

No arquivo `src/services/api.js`:

- Todas as chamadas (`apiGet`, `apiPost`, `apiPatch`, `apiDelete`) passam por uma função base `apiFetch`.
- Se uma requisição receber `401` (access token expirado):
  1. O frontend chama `POST /api/users/token/refresh/` com o `refreshToken`.
  2. Se for bem-sucedido, salva o novo `accessToken` e refaz automaticamente a requisição original.
  3. Se o refresh falhar (refresh expirado ou inválido), limpa os tokens e redireciona para `/login`.

Isso evita que o usuário seja desconectado no meio do uso normal da aplicação.

---

## Telas principais

Sugestão: adicione screenshots aqui depois (substitua pelos seus arquivos):

- Tela de login  
- Dashboard `/home` com botões para Pacientes e Agendamentos  
- Lista de pacientes  
- Formulário de paciente  
- Lista de agendamentos  
- Formulário de agendamento  

Exemplo de marcação:

```markdown
### Tela de login

![Tela de login](./docs/images/login.png)

### Lista de pacientes

![Lista de pacientes](./docs/images/patients-list.png)
```

---

## Boas práticas de segurança aplicadas

- Senhas armazenadas com hashing (padrão Django).
- Autenticação via JWT (access + refresh token).
- Proteção de endpoints por permissões e papéis de usuário.
- Uso de `Authorization: Bearer <token>` em todas as requisições autenticadas.
- Separação de credenciais sensíveis via variáveis de ambiente (ex.: secret key, debug, etc.).
- Nenhum secret versionado em repositório.

---

## Próximos passos (roadmap do projeto)

- Melhorar UI/UX do frontend (estilização mais elaborada)
- Adicionar testes automatizados:
  - Backend: pytest + cobertura mínima
  - Frontend: testes de componentes
- Adicionar Docker/Docker Compose para subir backend + frontend juntos
- Deploy em ambiente de nuvem (Render, Railway, etc.)

---

## Autor: M@rkitowb

Projeto desenvolvido para portfólio como desenvolvedor Python/Full Stack.

Sinta-se à vontade para abrir issues, sugerir melhorias ou usar este projeto como referência de estudo.