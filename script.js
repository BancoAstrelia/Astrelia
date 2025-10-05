// Formateo de miles en español (solo enteros, puntos como separadores)
function formatMilesES(rawDigits) {
  // rawDigits: string solo con dígitos, sin signos ni separadores
  if (!rawDigits) return "";
  // Inserta puntos cada 3 dígitos desde la derecha
  return rawDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Preserva el cursor al formatear miles mientras se escribe
function formatInputPreserveCaret(input) {
  const prev = input.value;
  const prevPos = input.selectionStart;

  // Dígitos a la izquierda del cursor antes de formatear
  const leftDigits = prev.slice(0, prevPos).replace(/\D/g, "").length;

  // Quitar todo lo que no sea dígito
  const raw = prev.replace(/\D/g, "");

  // Formatear con puntos de miles
  const formatted = formatMilesES(raw);
  input.value = formatted;

  // Recalcular posición del cursor: avanzar hasta consumir 'leftDigits' dígitos
  let pos = 0;
  let consumed = 0;
  while (pos < input.value.length && consumed < leftDigits) {
    if (/\d/.test(input.value[pos])) consumed++;
    pos++;
  }
  input.setSelectionRange(pos, pos);
}

// Obtiene el monto como número a partir del input formateado
function getMontoNumber(input) {
  const raw = input.value.replace(/\D/g, "");
  if (!raw) return NaN;
  return parseFloat(raw); // entero en Lempiras
}

// Formateo monetario con decimales para resultado
const formatMoney = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// Elementos
const montoInput = document.getElementById("monto");
const semanasInput = document.getElementById("semanas");
const resultadoDiv = document.getElementById("resultado");

// Formatear mientras escribe sin borrar ni saltar el cursor
montoInput.addEventListener("input", () => {
  formatInputPreserveCaret(montoInput);
});

// También formatear al pegar
montoInput.addEventListener("paste", (e) => {
  // Esperar a que el valor se inserte y luego formatear
  setTimeout(() => formatInputPreserveCaret(montoInput), 0);
});

// Formatear al salir del campo (por si el dispositivo envía caracteres raros)
montoInput.addEventListener("blur", () => {
  formatInputPreserveCaret(montoInput);
});

// Cálculo del pago total usando la fórmula tipo PAGO de Excel
// Pago = (r * PV) / (1 - (1 + r)^(-n))  --> Pago total = Pago * n
document.getElementById("loanForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const monto = getMontoNumber(montoInput); // número entero
  const semanas = parseInt(semanasInput.value, 10);
  const tasa = 0.0155; // 1.55% semanal

  if (isNaN(monto) || monto <= 0 || isNaN(semanas) || semanas <= 0) {
    resultadoDiv.textContent = "Por favor ingresa valores válidos.";
    return;
  }

  // Cuota semanal (PAGO)
  const pagoSemanal = (tasa * monto) / (1 - Math.pow(1 + tasa, -semanas));

  // Pago total al finalizar
  const pagoTotal = pagoSemanal * semanas;

  // Mostrar resultado con formato monetario
  resultadoDiv.innerHTML =
    `El pago total al finalizar será de:<br><strong>L. ${formatMoney.format(pagoTotal)}</strong>`;
});
