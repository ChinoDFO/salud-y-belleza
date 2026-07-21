import './App.css';
import { Navbar } from './components/Navbar';
import logo_Salud_y_Belleza_Blanco from './logo_salud_y_belleza_blanco.png';
import { Info } from './components/Info';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="hero">
        {/* Usamos una sola clase contenedora para el espaciado del Logo */}
        <section>
          <div className="Logo-container">
            <img src={logo_Salud_y_Belleza_Blanco} className="App-logo2" alt="logo" />
          </div>
        </section>
        {/* Primera sección de texto */}
        <section className="Info">
          <Info>
            <p> 
              Nosotros somos "Salud Y Belleza", un conjunto de dos locales donde ofrecemos servicios de:
              -Podología
              -Limpieza Facial
            </p>
          </Info>
        </section>
        {/* Segunda sección de texto con margen extra para permitir scroll */}
        <section className="Info Info-last">
          <p className="Info">
            En nuestra tienda encontrarás una amplia variedad de productos de alta calidad para el cuidado de tu piel, cabello y cuerpo.
          </p>
        </section>
      </div>
    </div>
  );
}

export default App;