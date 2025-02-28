import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative h-screen">
      <Image src="/images/pizza-background.jpg" alt='' layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center">
      {/*   <Image src="/images/pizza-jai-logo2.jpg" alt="Pizza Jai Logo" width={200} height={200} /> */}
        <h1 className="text-white border-red-500 text-6xl font-bold -mt-32">¡Bienvenido a Pizza Jai Delivery!</h1>
        <h2 className="text-white text-3xl font-bold mt-4">¡Hace tu pedido ya!</h2>
      </div>
    </div>
  );
}