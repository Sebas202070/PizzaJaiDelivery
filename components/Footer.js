const Footer = () => {
  return (
    <footer className="bg-red-500 text-white p-4 w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4  text-shadow-red md:mb-0">
          <p>&copy; {new Date().getFullYear()} Pizza Jai Delivery</p>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0  text-shadow-red md:space-x-4">
          <a href="/terminos-y-condiciones">Términos y condiciones</a>
          <a href="/politica-de-privacidad">Política de privacidad</a>
        </div>
        <div className="flex space-x-4 mt-4  text-shadow-red md:mt-0"> {/* Redes sociales (opcional) */}
          <a href="#" className="hover:text-gray-300">Facebook</a>
          <a href="#" className="hover:text-gray-300">Twitter</a>
          <a href="#" className="hover:text-gray-300">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;