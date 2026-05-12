from faker import Faker

fake = Faker("pt_BR")


def make_patient_data(overrides: dict | None = None) -> dict:
    """
    Gera um dicionário com dados válidos de paciente.
    Use o parâmetro `overrides` para sobrescrever campos específicos.

    Exemplo:
        make_patient_data({"cpf": "000.000.000-00"})
    """
    data = {
        "full_name": fake.name(),
        "cpf": fake.cpf(),
        "phone_number": fake.phone_number()[:20],
        "email": fake.email(),
        "date_of_birth": "1990-01-01",
        "gender": "M",
        "address": fake.address()[:255],
        "notes": "Paciente gerado para teste automatizado.",
    }

    if overrides:
        data.update(overrides)

    return data