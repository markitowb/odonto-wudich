# Odonto‑Wudich

Sistema completo para gestão de **clínica odontológica**, com backend em **Python/Django** e frontend (em desenvolvimento) em **React**.

> Projeto focado em demonstrar habilidades reais em desenvolvimento backend com **Django REST Framework**, boas práticas de **segurança** e **código limpo**, voltado para ajudar dentistas a gerenciar suas consultas, dados de paciente e demais dados de sua clínica.

---

## Estrutura do projeto

```text
odonto-wudich/
├── odonto-wudich-backend/   # API REST em Django + DRF + JWT
└── odonto-wudich-frontend/  # (em breve) frontend em React/Next.js
```

### Backend – Django REST API

- **Stack:** Python 3.10, Django 4, Django REST Framework
- **Autenticação:** JWT (djangorestframework-simplejwt)
- **Documentação da API:** drf-spectacular (OpenAPI 3, Swagger UI, Redoc)
- **Banco de dados (dev):** SQLite
- **Banco de dados (produção – planejado):** PostgreSQL

Funcionalidades principais:

- **Usuários** (CustomUser) com `role`:
  - `dentist`
  - `secretary`
- **Pacientes**:
  - CRUD completo, com CPF único.
  - Campos como nome, contato, data de nascimento, observações.
- **Consultas**:
  - Agendamentos ligando paciente + dentista + data/hora.
  - Campos: `start_datetime`, `end_datetime`, `status` (`scheduled`, `completed`, `canceled`), `notes`.
  - Filtros por paciente, dentista e data.
- **Permissões**:
  - Qualquer usuário autenticado pode listar pacientes e consultas.
  - Apenas `dentist` ou `secretary` podem criar/editar/deletar pacientes e consultas.
  - Apenas `dentist` pode marcar consulta como **concluída** (`status = completed`).

Mais detalhes técnicos estão no README específico do backend:  
👉 [`odonto-wudich-backend/README.md`](./odonto-wudich-backend/README.md)

### Frontend – React / Next.js (planejado)

- Consumo da API REST do backend.
- Telas previstas:
  - Login
  - Lista de pacientes
  - Detalhe/cadastro de paciente
  - Agenda de consultas
- Stack prevista:
  - React, React Router ou Next.js
  - Axios ou fetch para consumo da API
  - Controle de sessão com JWT no frontend

---

## Foco em boas práticas

Este projeto é construído com os seguintes pilares:

- **Código limpo:**
  - Nomenclatura clara, responsabilidade única por função/classe.
  - DRY, KISS, SRP (Single Responsibility Principle).
- **Segurança:**
  - Senhas com hash seguro (padrão Django).
  - Variáveis sensíveis em `.env` (não versionado).
  - Autenticação JWT com tempos de expiração configuráveis.
  - Permissões baseadas em papéis (`role`) nas APIs.
- **Organização:**
  - Commits semânticos (`feat`, `fix`, `docs`, `chore`, etc.).
  - Separação clara de backend/frontend.
  - Documentação de API via Swagger/Redoc.

---

## Como rodar o projeto localmente (backend)

Dentro de `odonto-wudich-backend/`:

```bash
# 1) Criar e ativar o ambiente virtual
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# source venv/bin/activate   # Linux/macOS

# 2) Instalar dependências
pip install -r requirements.txt

# 3) Criar arquivo .env
cp .env.example .env
# edite .env com SECRET_KEY e demais configs

# 4) Aplicar migrações e criar superusuário
python manage.py migrate
python manage.py createsuperuser

# 5) Subir o servidor
python manage.py runserver
```

A API estará em `http://127.0.0.1:8000/api/`.

### Documentação da API

- Swagger UI: `http://127.0.0.1:8000/api/schema/swagger-ui/`
- Redoc: `http://127.0.0.1:8000/api/schema/redoc/`

---

## Objetivo deste projeto

Este projeto foi desenvolvido com o objetivo de:

- Consolidar habilidades em **Django REST Framework** e **Python backend**.
- Demonstrar preocupação com **segurança**, **permissões** e **estrutura de projeto**.
- Servir como **projeto de portfólio** e para ajudar meu irmão no gerenciamento seus pacientes.

---
