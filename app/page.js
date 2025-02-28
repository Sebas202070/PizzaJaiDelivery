import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative h-screen">
      <Image src="/images/pizza1.jpg" alt='' layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center -mt-54">
      
        <h1 className="text-white text-6xl font-bold mt-8 text-center">¡Bienvenido a Pizza Jai Delivery!</h1> {/* Agregado text-center */}
        <h2 className="text-white text-3xl font-bold mt-4 text-center">¡Hace tu pedido ya!</h2> {/* Agregado text-center */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {/* ... (cards de pizza) ... */}
        </div>
      </div>
    </div>
  );
}