// Formateo monetario con miles y decimales (es-ES)
const formatMoney = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// Formateo de miles (entero) para la vista previa
function formatMilesESFromDigits(rawDigits) {
  if (!rawDigits) return "";
  return rawDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Elementos
const montoInput = document.getElementById("monto");
const montoPreview = document.getElementById("montoPreview");
const semanasInput = document.getElementById("semanas");
const resultadoDiv = document.getElementById("resultado");

// Mantener el input como "crudo" (solo dígitos) y mostrar vista formateada aparte
montoInput.addEventListener("input", () => {
  // Permitir solo dígitos; eliminar todo lo demás
  const raw = montoInput.value.replace(/\D/g, "");
  montoInput.value = raw; // valor estable sin formateo (no mueve el cursor)
  montoPreview.textContent = raw ? `L. ${formatMilesESFromDigits(raw)}` : "—";
});

// Cálculo del pago total usando la fórmula tipo PAGO de Excel
// Pago = (r * PV) / (1 - (1 + r)^(-n))  --> Pago total = Pago * n
document.getElementById("loanForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const raw = montoInput.value.replace(/\D/g, "");
  const monto = raw ? parseFloat(raw) : NaN;     // entero en Lempiras
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
    `El pago total al finalizar será de:<br><strong>$  ${formatMoney.format(pagoTotal)}</strong>`;
});

