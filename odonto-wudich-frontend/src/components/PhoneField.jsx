import { useState } from "react";
import TextField from "@mui/material/TextField";

/**
 * Aplica máscara de telefone brasileiro:
 * - 8 dígitos: (XX) XXXX-XXXX
 * - 9 dígitos: (XX) XXXXX-XXXX
 * Limita a 11 dígitos no total (DDD + número).
 */
function maskPhone(raw) {
  // mantém só números e limita a 11 dígitos (DDD + 9 dígitos)
  const digits = raw.replace(/\D/g, "").slice(0, 11);

  let masked = digits;

  if (digits.length > 2) {
    masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length > 7) {
    // a partir do 8º dígito, insere o traço
    masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length > 2 && digits.length <= 7) {
    masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return { digits, masked };
}

/**
 * Campo de telefone com máscara brasileira:
 * - (XX) XXXX-XXXX  → fixo (10 dígitos)
 * - (XX) XXXXX-XXXX → celular (11 dígitos)
 * - Envia ao pai apenas os dígitos (sem máscara)
 */
export default function PhoneField({ value, onChange, ...props }) {
  const [error, setError] = useState("");

  // monta a máscara para exibir a partir dos dígitos armazenados
  const { masked } = maskPhone(value || "");

  function handleChange(event) {
    const raw = event.target.value || "";
    const { digits } = maskPhone(raw);

    // Validação: mínimo de 10 dígitos (DDD + 8 dígitos fixo)
    if (digits.length > 0 && digits.length < 10) {
      setError("Telefone incompleto. Use DDD + número.");
    } else {
      setError("");
    }

    // envia só os dígitos para o formulário pai
    onChange(digits);
  }

  return (
    <TextField
      {...props}
      label="Telefone"
      value={masked}
      onChange={handleChange}
      error={Boolean(error)}
      helperText={error || "Ex.: (51) 98765-4321"}
      inputProps={{
        maxLength: 16, // (XX) XXXXX-XXXX = 15 chars + margem
        inputMode: "numeric",
      }}
    />
  );
}