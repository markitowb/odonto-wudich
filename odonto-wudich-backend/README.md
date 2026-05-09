# Odonto‑Wudich – Backend

Sistema de gestão odontológica desenvolvido em **Python 3.10**, **Django 4** e **Django REST Framework**, com autenticação via **JWT**, controle de pacientes e agendamento de consultas.

Este projeto faz parte do meu portfólio como desenvolvedor Python.

---

## Stack técnica

- **Linguagem:** Python 3.10+
- **Framework web:** Django 4.x
- **API REST:** Django REST Framework
- **Autenticação:** JWT (djangorestframework-simplejwt)
- **Documentação:** drf-spectacular (OpenAPI 3, Swagger UI, Redoc)
- **Banco de dados (dev):** SQLite
- **Banco de dados (produção – opcional):** PostgreSQL
- **Ferramentas:** Thunder Client / Postman para testes de API

---

## Funcionalidades principais

### Usuários (`CustomUser`)

- Modelo de usuário customizado (`AUTH_USER_MODEL = "users.CustomUser"`).
- Campos extras: `role` (`dentist` ou `secretary`), CPF, telefone, endereço, etc.
- Autenticação via JWT:
  - `POST /api/users/token/` – obtém `access` e `refresh`.
  - `POST /api/users/token/refresh/` – renova o `access`.
- Endpoint do usuário autenticado:
  - `GET /api/users/me/` – retorna dados do usuário logado.
  - `PATCH /api/users/me/` – atualiza dados próprios (exceto senha e role).

### Pacientes (`patients`)

- CRUD de pacientes:
  - `GET /api/patients/` – lista pacientes.
  - `POST /api/patients/` – cria paciente.
  - `GET /api/patients/{id}/` – detalhes.
  - `PUT/PATCH /api/patients/{id}/` – atualiza.
  - `DELETE /api/patients/{id}/` – remove.
- Campos principais:
  - `full_name`, `cpf` (único), `phone_number`, `email`,
  - `date_of_birth`, `gender`, `address`, `notes`.
- Relacionamento com usuário que criou (`created_by`).

### Consultas / Agendamentos (`appointments`)

- CRUD de consultas:
  - `GET /api/appointments/` – lista consultas.
  - `POST /api/appointments/` – cria consulta.
  - `GET /api/appointments/{id}/` – detalhes.
  - `PUT/PATCH /api/appointments/{id}/` – atualiza.
  - `DELETE /api/appointments/{id}/` – remove.
- Campos principais:
  - `patient` (FK para `Patient`),
  - `dentist` (FK para `CustomUser`),
  - `start_datetime`, `end_datetime`,
  - `status` (`scheduled`, `completed`, `canceled`),
  - `notes`.
- Filtros por query string:
  - `?patient_id=1`
  - `?dentist_id=1`
  - `?date=2026-05-10`

### Regras de permissão (Security / Roles)

- **Pacientes**
  - Leitura: qualquer usuário autenticado.
  - Escrita (POST, PUT, PATCH, DELETE): apenas usuários com `role = dentist` ou `role = secretary` (ou `is_staff`).
- **Consultas**
  - Leitura: qualquer usuário autenticado.
  - Escrita: apenas `dentist` ou `secretary` (ou `is_staff`).
  - Apenas `dentist` pode alterar o `status` da consulta para `completed`.

---

## Como rodar o projeto localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/odonto-wudich.git
cd odonto-wudich/odonto-wudich-backend
```

### 2. Criar e ativar o ambiente virtual

```bash
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Linux / macOS
# source venv/bin/activate
```

### 3. Instalar dependências

```bash
pip install -r requirements.txt
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do backend, baseado em um `.env.example` (se existir):

```env
DEBUG=True
SECRET_KEY=troque-por-uma-chave-segura
ALLOWED_HOSTS=127.0.0.1,localhost

# Banco de dados padrão (SQLite)
# Para PostgreSQL, configure:
# DB_NAME=odonto
# DB_USER=odonto
# DB_PASSWORD=senha
# DB_HOST=localhost
# DB_PORT=5432
```

> **Importante:** o arquivo `.env` está no `.gitignore` e **não deve** ser commitado no GitHub.

### 5. Aplicar migrações e criar superusuário

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 6. Rodar o servidor de desenvolvimento

```bash
python manage.py runserver
```

A API estará disponível em:

- `http://127.0.0.1:8000/api/`

---

## Documentação da API

Documentação gerada automaticamente com **drf-spectacular**:

- **OpenAPI Schema (JSON):**  
  `http://127.0.0.1:8000/api/schema/`
- **Swagger UI:**  
  `http://127.0.0.1:8000/api/schema/swagger-ui/`
- **Redoc:**  
  `http://127.0.0.1:8000/api/schema/redoc/`

Nessas interfaces é possível:

- visualizar todos os endpoints,
- ver os modelos de request/response,
- testar as chamadas (enviando o token JWT no header `Authorization: Bearer <token>`).

---

## Segurança e boas práticas

- Senhas de usuários armazenadas com hash seguro (padrão Django).
- JWT com tempo de expiração configurado em `SIMPLE_JWT`.
- Uso de variáveis de ambiente para segredos (`SECRET_KEY`, dados de banco, etc.).
- Permissões baseadas em papéis (`role`) e `IsAuthenticated`.
- Projeto preparado para uso de banco PostgreSQL em produção.

---

## Exemplos de uso (via Thunder Client / Postman)

### 1) Obter token JWT

`POST /api/users/token/`

```json
{
  "username": "admin",
  "password": "sua_senha"
}
```

Resposta:

```json
{
  "refresh": "eyJ...",
  "access": "eyJ..."
}
```

### 2) Listar pacientes

`GET /api/patients/` com header:

```http
Authorization: Bearer SEU_ACCESS_TOKEN
```

### 3) Criar consulta

`POST /api/appointments/`:

```json
{
  "patient_id": 1,
  "dentist_id": 1,
  "start_datetime": "2026-05-15T10:00:00",
  "end_datetime": "2026-05-15T10:30:00",
  "status": "scheduled",
  "notes": "Consulta de avaliação."
}
```

---

## Testes (planejado)

- Configuração de testes com **pytest**.
- Cobertura mínima alvo: **≥ 70%** para models, serializers e views.

---

## Roadmap / Próximos passos

- [ ] Criar testes automatizados (pytest + coverage).
- [ ] Adicionar suporte a Docker + docker-compose (Django + PostgreSQL).
- [ ] Criar frontend em React/Next.js para consumo da API.
- [ ] Integração com serviço de e-mail para lembretes de consulta.
- [ ] Deploy em ambiente cloud (Railway/Render/AWS/Heroku).

---

## Autor

- Nome: M@rkitowb
- LinkedIn: [marcus borba](https://www.linkedin.com/in/marcusviniciuswb/)
- GitHub: [@markitowb](https://github.com/markitowb)

---

## 📌 Objetivo do projeto

Este projeto foi desenvolvido com foco em:

- consolidar conhecimentos em **Django REST Framework**,
- aplicar **boas práticas de segurança** e **código limpo**,
- servir como **projeto de portfólio**.