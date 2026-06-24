# Odonto Wudich – Sistema Odontológico Full Stack

Aplicação Full Stack para gestão de clínica odontológica,
desenvolvida com foco em boas práticas, segurança e portfólio
profissional.

## Funcionalidades

- Login com JWT (access + refresh token)
- Refresh automático de access token
- Rotas privadas no frontend
- Cadastro, edição, listagem e exclusão de pacientes
- Validação e máscara de CPF
- Máscara de telefone brasileiro
- Agenda semanal de consultas estilo Google Calendar
- Criação e edição de agendamentos
- Interface responsiva com Material UI

---

## Arquitetura

```bash
odonto-wudich/
├── odonto-wudich-backend/    # API REST — Django 6 + DRF
└── odonto-wudich-frontend/   # SPA — React + Vite
```

---

## Tecnologias Principais

### Backend
- Python 3.12+
- Django 6.0.4
- Django REST Framework 3.17.1
- SimpleJWT 5.5.1
- drf-spectacular 0.29.0
- django-cors-headers 4.9.0
- python-decouple 3.8
- SQLite3 (desenvolvimento)
- Pronto para PostgreSQL em produção (psycopg2-binary instalado)
- pytest + pytest-django + Faker (testes automatizados)

### Frontend
- React
- Vite
- JavaScript ES6+
- React Router DOM
- Material UI (MUI)
- MUI X Date Pickers
- Fetch API

---

## Como Rodar o Backend

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

> Nunca suba o arquivo `.env` para o repositório.

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API disponível em: `http://127.0.0.1:8000/api/`

---

## Como Rodar o Frontend

```bash
cd odonto-wudich-frontend
npm.cmd install
npm.cmd run dev
```

Frontend disponível em: `http://localhost:5173/`

> O backend precisa estar rodando em `http://127.0.0.1:8000/`.

---

## Documentação da API

Gerada automaticamente com drf-spectacular:

- Swagger UI: `http://127.0.0.1:8000/api/schema/swagger-ui/`
- Redoc: `http://127.0.0.1:8000/api/schema/redoc/`

---

## Segurança

- Senhas armazenadas com hashing seguro (padrão Django)
- Autenticação JWT com access token e refresh token
- Refresh automático de token no frontend
- Rotas privadas protegidas no frontend
- Endpoints protegidos por autenticação e permissões
- Variáveis de ambiente para segredos e configurações sensíveis
- Nenhum secret versionado no repositório

---

## Próximas Melhorias

- Identidade visual própria com logo e favicon
- Testes automatizados no frontend
- Expandir cobertura de testes no backend
- Docker e docker-compose
- Deploy em ambiente de nuvem (Render ou Railway)

---

## Autor

**M@rkitowb**
Desenvolvedor Python | Django | React

- GitHub: [https://github.com/markitowb](https://github.com/markitowb)
- LinkedIn: [https://www.linkedin.com/in/marcusviniciuswb](https://www.linkedin.com/in/marcusviniciuswb)