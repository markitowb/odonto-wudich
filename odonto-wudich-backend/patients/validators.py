from rest_framework.exceptions import ValidationError


def validate_cpf(cpf: str) -> str:
    """
    Valida um CPF brasileiro.

    Remove caracteres não numéricos, verifica o comprimento e
    calcula os dois dígitos verificadores conforme o algoritmo
    oficial da Receita Federal.

    Args:
        cpf: String com o CPF (pode conter máscara ou não).

    Returns:
        CPF limpo (somente dígitos) se válido.

    Raises:
        ValidationError: Se o CPF for inválido.
    """
    # Remove tudo que não for dígito
    cpf_digits: str = "".join(filter(str.isdigit, cpf))

    # Deve ter exatamente 11 dígitos
    if len(cpf_digits) != 11:
        raise ValidationError("CPF deve conter 11 dígitos.")

    # Rejeita sequências conhecidas como inválidas (ex: 000.000.000-00)
    if cpf_digits == cpf_digits[0] * 11:
        raise ValidationError("CPF inválido.")

    # Valida o primeiro dígito verificador
    total = sum(
        int(digit) * weight
        for digit, weight in zip(cpf_digits[:9], range(10, 1, -1))
    )
    first_digit = (total * 10 % 11) % 10
    if first_digit != int(cpf_digits[9]):
        raise ValidationError("CPF inválido.")

    # Valida o segundo dígito verificador
    total = sum(
        int(digit) * weight
        for digit, weight in zip(cpf_digits[:10], range(11, 1, -1))
    )
    second_digit = (total * 10 % 11) % 10
    if second_digit != int(cpf_digits[10]):
        raise ValidationError("CPF inválido.")

    # Retorna somente os dígitos (sem máscara)
    # Não armazenamos a máscara no banco – apenas os 11 dígitos
    return cpf_digits