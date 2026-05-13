# Odonto Wudich - Backend

API REST para gestão de clínica odontológica, construída com **Django 6** e **Django REST Framework**, com autenticação JWT, controle de permissões por papel (dentista, secretária) e **testes automatizados com pytest**.

Este backend foi pensado para uso real em produção e como projeto de portfólio de desenvolvimento Python.

---

## Tecnologias Utilizadas

- **Linguagem**
  - Python 3.12

- **Frameworks**
  - Django 6
  - Django REST Framework
  - drf-spectacular (documentação OpenAPI/Swagger)

- **Autenticação e Autorização**
  - JWT (SimpleJWT)
  - Permissões por role (dentist, secretary)

- **Banco de Dados**
  - SQLite (desenvolvimento)
  - ORM do Django

- **Testes**
  - pytest
  - pytest-django
  - Faker

---

## Domínio e Arquitetura

A API trabalha hoje com dois domínios principais:

### 1. Usuários (`users`)

- Modelo de usuário customizado (`CustomUser`) com campo `role`:
  - `dentist`
  - `secretary`
- Autenticação via JWT (login, refresh, etc.)

### 2. Pacientes (`patients`)

- CRUD completo de pacientes.
- Regras importantes:
  - CPF único (validação em nível de banco).
  - Apenas usuários autenticados podem listar e criar pacientes.
- Endpoints protegidos por autenticação.

### 3. Consultas (`appointments`)

- Criação, listagem, atualização e cancelamento de consultas.
- Campos principais:
  - `patient`
  - `dentist`
  - `start_datetime`
  - `end_datetime`
  - `status` (`scheduled`, `completed`, `canceled`)
- Regras de negócio:
  - Dentista e secretária podem criar consultas.
  - **Apenas o dentista pode marcar uma consulta como `completed`.**
  - Usuário não autenticado não consegue acessar endpoints de consultas.

---

## Segurança

Alguns cuidados de segurança adotados no projeto:

- Uso de **variáveis de ambiente** para credenciais e configurações sensíveis (não são commitadas no repositório).
- Senhas de usuários armazenadas com hashing seguro (padrão do Django).
- Endpoints protegidos com:
  - `IsAuthenticated` onde necessário.
  - Permissões customizadas para regras de negócio (dentista x secretária).
- Proteções padrão do Django:
  - CSRF, XSS, SQL Injection (via ORM e middleware).
- Uso de `USE_TZ = True` e `timezone.now()` para evitar problemas com datas e horários.

---

## Testes Automatizados

Os testes foram desenvolvidos com **pytest** + **pytest-django** e cobrem:

### Pacientes (`patients/tests/`)

- **Modelo**
  - Criação de paciente com sucesso.
  - CPF deve ser único (gera `IntegrityError` se duplicado).
  - Representação textual (`__str__`) retorna o nome completo.

- **API**
  - Usuário não autenticado **não** consegue:
    - listar pacientes (401)
    - criar pacientes (401)
  - Dentista:
    - lista pacientes (200)
    - cria paciente (201)
    - visualiza detalhes de um paciente (200)
    - atualiza paciente (200)
    - exclui paciente (204)
  - Secretária:
    - consegue criar pacientes (201)

### Consultas (`appointments/tests/`)

- Usuário não autenticado:
  - não consegue criar consultas (401)
  - não consegue listar consultas (401)
  - não consegue atualizar consultas (401)

- Dentista:
  - cria consulta (201)
  - lista consultas (200)
  - visualiza detalhes (200)
  - cancela consulta (200)
  - **marca consulta como `completed` (200)**

- Secretária:
  - cria consulta (201)
  - cancela consulta (200)
  - **não pode marcar consulta como `completed` (403)**

#### Como rodar os testes

```bash
# dentro de odonto-wudich-backend, com venv ativo
pytest -v
```

---

## Como Rodar o Projeto Localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/odonto-wudich.git
cd odonto-wudich/odonto-wudich-backend
```

### 2. Criar e ativar o ambiente virtual

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate
```

### 3. Instalar dependências

```bash
pip install -r requirements.txt
```

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` (ou use outro mecanismo de variáveis de ambiente) com pelo menos:

```env
SECRET_KEY=uma_chave_secreta_segura
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

> **Importante:** o arquivo `.env` não deve ser commitado.

### 5. Aplicar migrações

```bash
python manage.py migrate
```

### 6. Criar superusuário (opcional, para acessar o Django Admin)

```bash
python manage.py createsuperuser
```

### 7. Rodar o servidor

```bash
python manage.py runserver
```

A API estará disponível em:

- `http://127.0.0.1:8000/api/`

---

## Endpoints Principais

Alguns endpoints importantes (resumo):

### Autenticação (JWT)

- `POST /api/token/` – obter access e refresh token
- `POST /api/token/refresh/` – renovar access token

### Pacientes

- `GET /api/patients/` – listar pacientes
- `POST /api/patients/` – criar paciente
- `GET /api/patients/{id}/` – detalhes de um paciente
- `PATCH /api/patients/{id}/` – atualizar paciente
- `DELETE /api/patients/{id}/` – excluir paciente

### Consultas

- `GET /api/appointments/` – listar consultas
- `POST /api/appointments/` – criar consulta
- `GET /api/appointments/{id}/` – detalhes de uma consulta
- `PATCH /api/appointments/{id}/` – atualizar status (`scheduled`, `completed`, `canceled`)

> A documentação Swagger (OpenAPI) pode ser acessada em:
>
> - `GET /api/schema/swagger-ui/`

---

## Próximos Passos / Melhorias

- Integração com frontend em React (odonto-wudich-frontend).
- Paginação e filtros avançados em pacientes e consultas.
- Logs estruturados e monitoramento.
- Deploy em ambiente de nuvem (Railway, Render, etc.).

---

## Autor

**M@rkitowb**  
Desenvolvedor Python | Django | APIs REST

- GitHub: [https://github.com/markitowb](https://github.com/markitowb)
- LinkedIn: [https://www.linkedin.com/in/marcusviniciuswb](https://www.linkedin.com/in/marcusviniciuswb)

---