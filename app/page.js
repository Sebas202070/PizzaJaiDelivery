import Image from 'next/image';
import PizzaCard from '../components/PizzaCard';

const pizzas = [
  {
    id: 1,
    name: 'Margarita',
    description: 'Tomate, mozzarella, albahaca',
    price: 2500,
    image: '/images/margarita.jpg',
  },
  {
    id: 2,
    name: 'Pepperoni',
    description: 'Tomate, mozzarella, pepperoni',
    price: 2000,
    image: '/images/pepperoni.jpg',
  },
  {
    id: 3,
    name: 'Vegetariana',
    description: 'Tomate, mozzarella, vegetales frescos',
    price: 3000,
    image: '/images/vegetariana.jpg',
  },
  {
    id: 4,
    name: 'Margarita',
    description: 'Tomate, mozzarella, albahaca',
    price: 2500,
    image: '/images/margarita.jpg',
  },
  {
    id: 5,
    name: 'Pepperoni',
    description: 'Tomate, mozzarella, pepperoni',
    price: 2000,
    image: '/images/pepperoni.jpg',
  },
  {
    id: 6,
    name: 'Vegetariana',
    description: 'Tomate, mozzarella, vegetales frescos',
    price: 3000,
    image: '/images/vegetariana.jpg',
  },
  {
    id: 7,
    name: 'Margarita',
    description: 'Tomate, mozzarella, albahaca',
    price: 2500,
    image: '/images/margarita.jpg',
  },
  {
    id: 8,
    name: 'Pepperoni',
    description: 'Tomate, mozzarella, pepperoni',
    price: 2000,
    image: '/images/pepperoni.jpg',
  },
  {
    id: 9,
    name: 'Vegetariana',
    description: 'Tomate, mozzarella, vegetales frescos',
    price: 3000,
    image: '/images/vegetariana.jpg',
  },
];

export default function Home() {
  return (
    <div className="relative">
      <div className="fixed inset-0 z-[-1]">
        <Image src="/images/pizza1.jpg" alt="" layout="fill" objectFit="cover" /> {/* Imagen de fondo aquí */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
      <div className="relative inset-0 flex flex-col items-center min-h-screen mt-2"> {/* Margen positivo */}
        <h1 className="text-white text-6xl font-bold text-center text-shadow-black">Bienvenido a Pizza Jai Delivery</h1>
        <h2 className="text-white text-3xl font-bold mt-4 text-center text-shadow-black">Elegi de entre mas de nuestras 20 exquisitas variedades</h2>
        <h2 className="text-white text-3xl font-bold mt-4 text-center text-shadow-black">¡y hace tu pedido ya!</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-12">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </div>
    </div>
  );
}