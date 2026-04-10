"""
Configurações exclusivas para desenvolvimento local.
NUNCA use essas configurações em produção.
"""

from .base import *  # noqa: F401, F403

# Em desenvolvimento, debug ativo para ver erros detalhados
# NUNCA True em produção — expõe informações sensíveis
DEBUG = True

# Em desenvolvimento, permite qualquer origem no CORS
# NUNCA True em produção
CORS_ALLOW_ALL_ORIGINS = True