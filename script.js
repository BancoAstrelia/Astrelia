const montoInput = document.getElementById("monto");
const semanasInput = document.getElementById("semanas");
const resultadoDiv = document.getElementById("resultado");

const formato = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// --- Calcular pago total ---
document.getElementById("loanForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Obtener monto crudo (sin puntos ni comas)
  let monto = parseFloat(montoInput.value.replace(/\./g, '').replace(',', '.'));
  let semanas = parseInt(semanasInput.value);
  const tasa = 0.0155; // 1.55% semanal

  if (monto > 0 && semanas > 0) {
    // Fórmula de PAGO (cuota semanal)
    const pagoSemanal = (tasa * monto) / (1 - Math.pow(1 + tasa, -semanas));
    // Pago total
    const pagoTotal = pagoSemanal * semanas;

    // Mostrar resultado con formato
    resultadoDiv.innerHTML = 
      `El pago total al finalizar será de:<br><strong>L. ${formato.format(pagoTotal)}</strong>`;

    // Reescribir el input ya formateado (solo al calcular)
    montoInput.value = new Intl.NumberFormat("es-ES").format(monto);
  } else {
    resultadoDiv.innerHTML = "Por favor ingresa valores válidos.";
  }
});
