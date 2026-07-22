import './App.css';
import { Navbar } from './components/Navbar';
import logo_Salud_y_Belleza_Blanco from './logo_salud_y_belleza_blanco.png';
import { Info } from './components/Info';

function App() {
  return (
    <div className="App">
      <div className="hero">
        {/* Usamos una sola clase contenedora para el espaciado del Logo */}
        <section>
          <div className="Logo-container" id="top">
            <img src={logo_Salud_y_Belleza_Blanco} className="App-logo2" alt="logo" />
            <div className="eslogan">
              <p>
                Tu Salud Es Nuestra Prioridad
              </p>
            </div>
          </div>
        </section>
      </div>
      {/* Primera sección de texto */}
      <section className="Info" id="Sobre-Nosotros">
        <Info delay={0.3}>
          <div className="Box">
            <h1 className="titulos-cajas"> ✨¿QUIÉNES SOMOS?✨ </h1>
            <div className="linea"> </div>
            <p>
              <br></br>
              En "Salud y Belleza" nos dedicamos a brindar atención personalizada enfocada en el bienestar, la salud y el cuidado personal.
              Somos un pequeño conjunto de locales conformado por dos especialistas comprometidas con ofrecer servicios de calidad,
              combinando experiencia, profesionalismo y un trato cercano para que cada visita sea una experiencia cómoda y satisfactoria.
              <br></br>
              <br></br>
              Nuestro objetivo es ayudarte a cuidar de ti mismo mediante tratamientos realizados con dedicación, utilizando técnicas y productos adecuados para cada necesidad.
              Contamos con servicios de podología y limpiezas faciales, pensados para promover tanto la salud como la belleza, siempre priorizando tu comodidad y bienestar.
              <br></br>
              <br></br>
              A través de esta página podrás conocer nuestros servicios y consultar la disponibilidad de nuestra agenda para programar tu próxima cita de forma rápida y sencilla.
              Será un placer acompañarte en el cuidado de tu salud y ayudarte a sentirte y verte mejor en cada visita.
            </p>
          </div>
        </Info>
        {/* Segunda sección de texto con margen extra para permitir scroll */}
        <section className="titulos" id="Servicios">
          <Info delay={0.3}>
            <h2>
              NUESTROS SERVICIOS
            </h2>
            <p className="subtitulos">
              Elige cualquiera de nuestros servicios para agendar tu proxima cita
            </p>
            <div className="sublinea"> </div>
          </Info>
        </section>
      </section>
      <Navbar />
    </div >
  );
}

export default App;