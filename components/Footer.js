const Footer = () => {
    return (
      <footer className="bg-red-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p>&copy; {new Date().getFullYear()} Pizza Jai Delivery</p>
          </div>
          <div>
            <a href="/terminos-y-condiciones" className="mr-4">Términos y condiciones</a>
            <a href="/politica-de-privacidad">Política de privacidad</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;