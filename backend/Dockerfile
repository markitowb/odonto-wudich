# Imagem base oficial do Python — versão slim (menor tamanho)
FROM python:3.12-slim

# Evita que o Python crie arquivos .pyc desnecessários
ENV PYTHONDONTWRITEBYTECODE=1

# Garante que os logs aparecem em tempo real no terminal
ENV PYTHONUNBUFFERED=1

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instala dependências do sistema necessárias para o psycopg2
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala dependências Python
# (separado do resto para aproveitar cache do Docker)
COPY requirements/base.txt requirements/base.txt
RUN pip install --no-cache-dir -r requirements/base.txt

# Copia o restante do código
COPY . .

# Porta que a aplicação vai usar
EXPOSE 8000