// components/TransferenciaBancaria.jsx
import { useState } from "react";

const TransferenciaBancaria = () => {
  const [comprobante, setComprobante] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleComprobanteChange = (e) => {
    setComprobante(e.target.files[0]);
  };

  const handleTransferencia = async (e) => {
    e.preventDefault();
    // Lógica para enviar el comprobante y confirmar la transferencia
    console.log("Comprobante:", comprobante);
    setMensaje("Transferencia en proceso de verificación.");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-xl font-semibold mb-4">Transferencia Bancaria</h3>
      <p className="mb-4">
        Por favor, realiza la transferencia a la siguiente cuenta:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Banco: [Nombre del Banco]</li>
        <li>Cuenta: [Número de Cuenta]</li>
        <li>CBU: [Número de CBU]</li>
        <li>Titular: [Nombre del Titular]</li>
      </ul>
      <form onSubmit={handleTransferencia} className="space-y-4">
        <div>
          <label
            htmlFor="comprobante"
            className="block text-sm font-medium text-gray-700"
          >
            Comprobante de Transferencia:
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="file"
              id="comprobante"
              onChange={handleComprobanteChange}
              className="flex-1 form-input block w-full rounded-md border-gray-300"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Confirmar Transferencia
          </button>
        </div>
      </form>
      {mensaje && <p className="mt-4 text-sm text-gray-600">{mensaje}</p>}
    </div>
  );
};

export default TransferenciaBancaria;
