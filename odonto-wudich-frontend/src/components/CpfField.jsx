import { useState } from "react";
import TextField from "@mui/material/TextField";

/**
 * Aplica máscara simples ao CPF:
 * - mantém só dígitos
 * - limita a 11 dígitos
 * - formata como 000.000.000-00
 */
function maskCpf(raw) {
  // mantém só números
  const digits = raw.replace(/\D/g, "").slice(0, 11);

  // monta máscara passo a passo
  let masked = digits;
  if (digits.length > 3) {
    masked = `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  if (digits.length > 6) {
    masked = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  if (digits.length > 9) {
    masked = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
      6,
      9
    )}-${digits.slice(9)}`;
  }

  return { digits, masked };
}

/**
 * Validação de CPF (algoritmo da Receita Federal)
 */
function isValidCpf(digits) {
  if (!digits || digits.length !== 11) return false;
  if (/(\d)\1{10}/.test(digits)) return false; // todos iguais

  let total = 0;

  // primeiro dígito verificador
  for (let i = 0; i < 9; i += 1) {
    total += parseInt(digits[i], 10) * (10 - i);
  }
  let firstDigit = (total * 10) % 11;
  if (firstDigit === 10 || firstDigit === 11) firstDigit = 0;
  if (firstDigit !== parseInt(digits[9], 10)) return false;

  // segundo dígito verificador
  total = 0;
  for (let i = 0; i < 10; i += 1) {
    total += parseInt(digits[i], 10) * (11 - i);
  }
  let secondDigit = (total * 10) % 11;
  if (secondDigit === 10 || secondDigit === 11) secondDigit = 0;
  if (secondDigit !== parseInt(digits[10], 10)) return false;

  return true;
}

/**
 * Campo de CPF:
 * - mostra máscara 000.000.000-00
 * - só permite 11 dígitos
 * - valida dígito verificador ao completar 11 dígitos
 * - envia ao pai apenas os dígitos (sem máscara)
 */
export default function CpfField({ value, onChange, ...props }) {
  // value aqui é sempre só dígitos vindo do pai
  const [error, setError] = useState("");

  // montamos a máscara para exibir
  const { masked } = maskCpf(value || "");

  function handleChange(event) {
    const raw = event.target.value || "";
    const { digits, masked: newMasked } = maskCpf(raw);

    // Validação: só quando completar 11 dígitos
    if (digits.length === 11) {
      if (!isValidCpf(digits)) {
        setError("CPF inválido. Verifique os números digitados.");
      } else {
        setError("");
      }
    } else {
      setError("");
    }

    // atualiza visualmente o campo
    event.target.value = newMasked;
    // envia só dígitos para o formulário pai
    onChange(digits);
  }

  return (
    <TextField
      {...props}
      label="CPF"
      value={masked}
      onChange={handleChange}
      error={Boolean(error)}
      helperText={error || "Somente CPF válido será aceito."}
      inputProps={{
        maxLength: 14, // 000.000.000-00
      }}
    />
  );
}