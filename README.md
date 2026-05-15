# Odonto Wudich

Sistema completo para gestão de clínica odontológica, com backend em **Django REST Framework** e frontend em **React** (em desenvolvimento).

O objetivo deste projeto é demonstrar, de forma prática, habilidades em:

- Desenvolvimento de APIs REST seguras e testadas
- Organização de código backend com Django
- Criação de frontend moderno consumindo APIs
- Boas práticas de Git, testes automatizados e documentação

---

## Estrutura do Projeto

Este repositório é organizado em duas pastas principais:

- `odonto-wudich-backend/` → API REST em Django / DRF
- `odonto-wudich-frontend/` → Aplicação React (em desenvolvimento)

Cada pasta possui seu próprio `README.md` com instruções de instalação e uso.

---

## Funcionalidades (Domínio da Aplicação)

O sistema foi pensado para atender uma clínica odontológica com:

### Usuários

- Usuários autenticados via **JWT** (login e refresh token).
- Perfis de usuário com **papéis (roles)**:
  - `dentist` – dentistas da clínica
  - `secretary` – secretárias responsáveis pelo atendimento

### Pacientes

- Cadastro e gerenciamento de pacientes.
- CPF único por paciente (validação em banco de dados).
- Listagem, atualização e exclusão de pacientes.
- Acesso aos endpoints restrito a usuários autenticados.

### Consultas

- Criação e gerenciamento de consultas odontológicas.
- Campos principais:
  - Paciente
  - Dentista responsável
  - Data/hora de início e fim
  - Status da consulta:
    - `scheduled`
    - `completed`
    - `canceled`
- Regras de negócio relevantes:
  - Dentista e secretária podem **agendar** consultas.
  - Apenas o **dentista** pode marcar consultas como **`completed`**.
  - Usuário não autenticado não tem acesso aos endpoints de consultas.

---

## Tecnologias

### Backend

- Python 3.12
- Django 6
- Django REST Framework
- SimpleJWT (autenticação JWT)
- drf-spectacular (documentação OpenAPI/Swagger)
- SQLite (ambiente de desenvolvimento)
- pytest + pytest-django + Faker (testes automatizados)

### Frontend (planejado / em desenvolvimento)

- React
- React Router
- Integração com a API via fetch/axios
- Gerenciamento básico de estado

---

## Qualidade e Testes

O backend conta com testes automatizados cobrindo:

- **Modelo de Pacientes**
  - Criação
  - Unicidade de CPF
  - Representação textual (`__str__`)

- **API de Pacientes**
  - Restrições de autenticação (401 para não autenticados)
  - Permissões para dentistas e secretárias
  - CRUD completo (listar, criar, detalhar, atualizar, deletar)

- **API de Consultas**
  - Criação de consultas por dentista e secretária
  - Listagem e detalhe de consultas
  - Regras de permissão:
    - Apenas dentista pode concluir (`completed`)
    - Ambos podem cancelar (`canceled`)
    - Não autenticados não podem criar, listar ou atualizar

Para detalhes completos dos testes e instruções de execução, consulte o README do backend:

➡ [`odonto-wudich-backend/README.md`](./odonto-wudich-backend/README.md)

---

## Como rodar o projeto (visão geral)

### 1. Backend (API)

Instruções detalhadas em  
[`odonto-wudich-backend/README.md`](./odonto-wudich-backend/README.md), mas o fluxo básico é:

```bash
cd odonto-wudich-backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

A API ficará disponível em:

- `http://127.0.0.1:8000/api/`

### 2. Frontend (em desenvolvimento)

Assim que a estrutura do frontend estiver criada, as instruções ficarão em:

➡ `odonto-wudich-frontend/README.md`

---

## Próximos Passos

- [ ] Implementar o frontend em React integrado à API:
  - Tela de login (JWT)
  - Listagem e cadastro de pacientes
  - Listagem e agendamento de consultas
- [ ] Adicionar paginação e filtros na API
- [ ] Configurar deploy (backend + frontend) em ambiente de nuvem
- [ ] Aumentar cobertura de testes automatizados

---

## Autor

**M@rkitowb**  
Desenvolvedor Python | Django | APIs REST

- GitHub: [https://github.com/markitowb](https://github.com/markitowb)
- LinkedIn: [https://www.linkedin.com/in/marcusviniciuswb](https://www.linkedin.com/in/marcusviniciuswb)