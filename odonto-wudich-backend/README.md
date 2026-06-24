# Odonto Wudich – Backend

API REST para gestão de clínica odontológica, construída com
**Django 6.0.4** e **Django REST Framework**, com autenticação
JWT, controle de permissões por papel e testes automatizados
com pytest.

---

## Tecnologias

|    Biblioteca         | Versão  |
|-----------------------|---------|
|    Python             | 3.12+   |
|    Django             | 6.0.4   |
| Django REST Framework | 3.17.1  |
|    SimpleJWT          | 5.5.1   |
|   drf-spectacular     | 0.29.0  |
| django-cors-headers   | 4.9.0   |
| python-decouple       | 3.8     |
|     pytest            | 9.0.3   |
|    pytest-django      | 4.12.0  |
|      Faker            | 40.15.0 |

**Banco de dados:**
- SQLite3 em desenvolvimento
- Pronto para PostgreSQL em produção (psycopg2-binary instalado)

---

## Domínio da Aplicação

### Usuários (`users`)
- Modelo de usuário customizado com campo `role`
- Autenticação JWT com access e refresh token
- Endpoints:
  - `POST /api/users/token/` — login
  - `POST /api/users/token/refresh/` — renovar token
  - `GET /api/users/me/` — dados do usuário autenticado
  - `PATCH /api/users/me/` — atualizar dados do usuário
  - `POST /api/users/register/` — registrar novo usuário
  - `GET /api/users/dentists/` — listar dentistas

### Pacientes (`patients`)
- CRUD completo
- CPF com validação e unicidade garantida
- Endpoints:
  - `GET /api/patients/`
  - `POST /api/patients/`
  - `GET /api/patients/{id}/`
  - `PUT /api/patients/{id}/`
  - `PATCH /api/patients/{id}/`
  - `DELETE /api/patients/{id}/`

### Consultas (`appointments`)
- Criação, listagem, atualização e cancelamento
- Controle de permissões por papel de usuário
- Endpoints:
  - `GET /api/appointments/`
  - `POST /api/appointments/`
  - `GET /api/appointments/{id}/`
  - `PUT /api/appointments/{id}/`
  - `PATCH /api/appointments/{id}/`
  - `DELETE /api/appointments/{id}/`

---

## Banco de Dados

```python
# config/settings.py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

> Para produção, o projeto já possui `psycopg2-binary` instalado,
> pronto para migrar para PostgreSQL.

---

## Autenticação JWT

Configurado com SimpleJWT:

- Access token: 5 minutos
- Refresh token: 1 dia
- Rotação de refresh token habilitada

---

## Segurança

- Variáveis de ambiente com `python-decouple`
- Senhas armazenadas com hashing seguro
- Endpoints protegidos com `IsAuthenticated`
- Permissões customizadas por papel de usuário
- CORS configurado com `django-cors-headers`
- Nenhum secret versionado no repositório

---

## Testes Automatizados

```bash
# Com venv ativo, dentro de odonto-wudich-backend
pytest -v
```

Cobertura atual:

### Pacientes
- Criação de paciente
- CPF único
- Representação textual do modelo
- Autenticação e autorização na API

### Consultas
- Criação, listagem e atualização
- Cancelamento de consulta
- Regras de permissão por papel

---

## Como Rodar o Projeto

```bash
cd odonto-wudich-backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
```

Crie o arquivo `.env`:

```env
SECRET_KEY=sua_chave_secreta_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API disponível em: `http://127.0.0.1:8000/api/`

---

## Documentação da API

- Swagger UI: `http://127.0.0.1:8000/api/schema/swagger-ui/`
- Redoc: `http://127.0.0.1:8000/api/schema/redoc/`

---

## Próximas Melhorias

- Migrar para PostgreSQL em produção
- Paginação e filtros avançados
- Logs estruturados
- Expandir cobertura de testes
- Deploy em nuvem

---

## Autor

**M@rkitowb**
Desenvolvedor Python | Django | APIs REST

- GitHub: [https://github.com/markitowb](https://github.com/markitowb)
- LinkedIn: [https://www.linkedin.com/in/marcusviniciuswb](https://www.linkedin.com/in/marcusviniciuswb)