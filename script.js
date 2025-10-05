document.getElementById("loanForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const montoInput = document.getElementById("monto");
  const semanas = parseInt(document.getElementById("semanas").value);
  const tasa = 0.0155; // 1.55% semanal

  // Convertir monto a número
  const monto = parseFloat(montoInput.value.replace(/\./g, '').replace(',', '.'));

  if (monto > 0 && semanas > 0) {
    // Fórmula de PAGO (cuota semanal)
    const pagoSemanal = (tasa * monto) / (1 - Math.pow(1 + tasa, -semanas));

    // Pago total
    const pagoTotal = pagoSemanal * semanas;

    // Formatear con separadores de miles estilo español
    const formato = new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    document.getElementById("resultado").innerHTML = 
      `El pago total al finalizar será de:<br><strong>L. ${formato.format(pagoTotal)}</strong>`;
  } else {
    document.getElementById("resultado").innerHTML = 
      "Por favor ingresa valores válidos.";
  }
});

// Formatear el input de monto en tiempo real con puntos de millares
document.getElementById("monto").addEventListener("input", function(e) {
  let valor = e.target.value.replace(/\./g, '').replace(',', '.');
  if (!isNaN(valor) && valor !== "") {
    let numero = parseFloat(valor);
    e.target.value = new Intl.NumberFormat("es-ES").format(numero);
  }
});
