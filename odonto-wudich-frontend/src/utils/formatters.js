/**
 * Formata CPF com máscara 000.000.000-00.
 * Se não tiver 11 dígitos, retorna o valor original.
 */
export function formatCpf(value) {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "");
  if (digits.length !== 11) return value;

  return digits.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  );
}

/**
 * Formata telefone brasileiro:
 * - 10 dígitos: (XX) XXXX-XXXX
 * - 11 dígitos: (XX) XXXXX-XXXX
 * Se não tiver 10 ou 11 dígitos, retorna o valor original.
 */
export function formatPhone(value) {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "");

  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return value; // retorna como veio se não bater o tamanho esperado
}