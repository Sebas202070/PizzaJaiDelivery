"use client";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import Image from "next/image";
import PaymentButton from "@/components/PaymentButton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { EnvioContext, EnvioProvider } from "../context/EnvioContext"; // Importa el contexto
import { useRouter, useSearchParams } from "next/navigation"; // Importa useRouter

const Carrito = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    total,
  } = useContext(CartContext);
  const { data: session } = useSession();
  const { updateAddress } = useContext(EnvioContext); // Obtén updateAddress del contexto
  const router = useRouter(); // Inicializa useRouter
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    number: "",
    floor: "",
    apartment: "",
    postalCode: "",
    city: "",
    province: "",
  });

  const [formAddress, setFormAddress] = useState({
    // Nuevo estado local para el formulario
    street: "",
    number: "",
    floor: "",
    apartment: "",
    postalCode: "",
    city: "",
    province: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const searchParams = useSearchParams();
  const [isAddressLoaded, setIsAddressLoaded] = useState(false);
  const [retirarEnLocal, setRetirarEnLocal] = useState(false);

  useEffect(() => {
    const storedAddress = localStorage.getItem("address");
    if (storedAddress) {
      try {
        const parsedAddress = JSON.parse(storedAddress);
        setFormAddress(parsedAddress);
        setRetirarEnLocal(parsedAddress.retirarEnLocal || false);
        setShowAddressForm(!parsedAddress.retirarEnLocal);
      } catch (error) {
        console.error(
          "Carrito: Error al parsear datos de localStorage:",
          error
        );
      }
    } else if (address && Object.keys(address).length > 0) {
      setFormAddress(address);
      setRetirarEnLocal(address.retirarEnLocal || false);
      setShowAddressForm(!address.retirarEnLocal);
    }
  }, [address]); // Dependencia en address para cargar datos del contexto

  const handleDeliveryOptionChange = (option) => {
    setDeliveryOption(option);
    setRetirarEnLocal(option === "pickup"); // Actualizar retirarEnLocal
    setShowAddressForm(option === "delivery");
    setShowOrderSummary(false);
    setFormAddress((prevFormAddress) => ({
      ...prevFormAddress,
      retirarEnLocal: option === "pickup",
    }));
  };
  const handleAddressChange = (e) => {
    const newFormAddress = { ...formAddress, [e.target.name]: e.target.value };
    setFormAddress(newFormAddress);
    console.log("Estado de dirección actualizado:", newFormAddress);
  };

  const handlePaymentSuccess = async () => {
    if (session && deliveryOption) {
      const orderData = {
        userId: session.user.id,
        cartItems,
        deliveryOption,
        address: deliveryOption === "delivery" ? formAddress : null, // Usar formAddress aquí
        total,
      };

      try {
        const saveResponse = await fetch("/api/saveOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (saveResponse.ok) {
          const emailResponse = await fetch("/api/sendEmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          });

          if (emailResponse.ok) {
            console.log("Orden guardada y correo enviado.");
            // Limpiar el carrito o realizar otras acciones necesarias
            localStorage.removeItem("address");
          } else {
            console.error("Error al enviar el correo.");
          }
        } else {
          console.error("Error al guardar la orden.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleContinue = () => {
    const updatedFormAddress = {
      ...formAddress,
      retirarEnLocal: deliveryOption === "pickup",
    };
    console.log("Datos de dirección enviados al contexto:", updatedFormAddress);
    setAddress(updatedFormAddress);
    updateAddress(updatedFormAddress);
    localStorage.setItem("address", JSON.stringify(updatedFormAddress));
    router.push("/datos-envio");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Carrito de Compras
        </h1>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white rounded-lg shadow-md p-4"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={80}
                    className="mr-4 rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <div className="flex items-center mt-2">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-l"
                        onClick={() => decreaseQuantity(index)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.cantidad}</span>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-r"
                        onClick={() => increaseQuantity(index)}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-lg">
                      ${item.price * item.cantidad}
                    </p>
                  </div>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    onClick={() => removeFromCart(index)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Resumen del Pedido
              </h2>
              <p className="text-lg font-semibold">Total: ${total}</p>

              <div className="mt-4">
                <h2 className="text-lg font-semibold">Opciones de Entrega:</h2>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="pickup"
                      checked={deliveryOption === "pickup"}
                      onChange={() => handleDeliveryOptionChange("pickup")}
                      className="mr-2"
                    />
                    Retiro en el local
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="delivery"
                      checked={deliveryOption === "delivery"}
                      onChange={() => handleDeliveryOptionChange("delivery")}
                      className="mr-2"
                    />
                    Envío a domicilio
                  </label>
                </div>
                {showAddressForm && address && (
                  <div className="mt-4">
                    <h3 className="block font-semibold mb-2">
                      Dirección de Envío:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="street"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Calle:
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formAddress.street}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="number"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Número:
                        </label>
                        <input
                          type="text"
                          name="number"
                          value={formAddress.number}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="floor"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Piso:
                        </label>
                        <input
                          type="text"
                          name="floor"
                          value={formAddress.floor}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="apartment"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Departamento:
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          value={formAddress.apartment}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="postalCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Código Postal:
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formAddress.postalCode}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Ciudad:
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formAddress.city}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="province"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Provincia:
                        </label>
                        <input
                          type="text"
                          name="province"
                          value={formAddress.province}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={handleContinue}
                >
                  Continuar
                </button>
                {showOrderSummary && (
                  <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">
                      Resumen de la Orden
                    </h2>
                    <div>
                      <h3 className="text-lg font-semibold">Pedido:</h3>
                      <ul>
                        {cartItems.map((item, index) => (
                          <li key={index}>
                            {item.name} x{item.cantidad} - $
                            {item.price * item.cantidad}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {deliveryOption === "delivery" && showOrderSummary && (
                      <div>
                        <h3 className="text-lg font-semibold">
                          Datos de Envío:
                        </h3>
                        <p>
                          Calle: {address.street} {address.number}
                        </p>
                        <p>
                          Piso: {address.floor}, Departamento:{" "}
                          {address.apartment}
                        </p>
                        <p>
                          Código Postal: {address.postalCode}, Ciudad:{" "}
                          {address.city}, Provincia: {address.province}
                        </p>
                      </div>
                    )}
                    {deliveryOption === "pickup" && showOrderSummary && (
                      <div>
                        <h3 className="text-lg font-semibold">
                          Retiro en el local
                        </h3>
                      </div>
                    )}
                    <p className="text-lg font-semibold">Total: ${total}</p>
                  </div>
                )}

                {session && deliveryOption && showOrderSummary ? (
                  <PaymentButton
                    cartItems={cartItems}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                ) : (
                  <>
                    {!session && (
                      <p className="text-center text-gray-600">
                        Debes iniciar sesión para comprar.{" "}
                        <Link href="/login" className="text-blue-500">
                          Iniciar sesión
                        </Link>
                      </p>
                    )}
                    {session && !deliveryOption && (
                      <p className="text-center text-gray-600">
                        Selecciona una opción de entrega para continuar.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;
