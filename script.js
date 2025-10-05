document.getElementById("loanForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const monto = parseFloat(document.getElementById("monto").value);
  const semanas = parseInt(document.getElementById("semanas").value);
  const tasa = 0.0155; // 1.55% semanal

  if (monto > 0 && semanas > 0) {
    // Fórmula de PAGO
    const pago = (tasa * monto) / (1 - Math.pow(1 + tasa, -semanas));

    document.getElementById("resultado").innerHTML = 
      `Tu pago semanal será de: <br><strong>L. ${pago.toFixed(2)}</strong>`;
  } else {
    document.getElementById("resultado").innerHTML = 
      "Por favor ingresa valores válidos.";
  }
});
