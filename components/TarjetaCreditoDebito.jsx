// components/TarjetaCreditoDebito.jsx
const TarjetaCreditoDebito = () => {
  // Lógica para manejar el pago con tarjeta de crédito/débito
  const handleTarjeta = () => {
    // ... (lógica para mostrar el formulario de la tarjeta y manejar el pago)
    console.log("Pago con tarjeta realizado");
  };

  return (
    <div>
      <h3>Tarjeta de Crédito/Débito</h3>
      <p>Ingresa los datos de tu tarjeta:</p>
      {/* ... (formulario de la tarjeta) */}
      <button onClick={handleTarjeta}>Pagar con Tarjeta</button>
    </div>
  );
};

export default TarjetaCreditoDebito;
