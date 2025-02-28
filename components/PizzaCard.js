import Image from 'next/image';
import { BsCartFill } from 'react-icons/bs';

const PizzaCard = ({ pizza }) => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-lg transition-shadow duration-300">
      <Image src={pizza.image} alt={pizza.name} width={200} height={100} className="rounded-t-lg" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{pizza.name}</h3>
        <p className="text-gray-600 text-center mb-2">{pizza.description}</p>
        <p className="font-bold text-lg mb-4">${pizza.price}</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center">
          <BsCartFill size={20} className="mr-2" />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default PizzaCard;