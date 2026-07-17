import './App.css';
import logo_Salud_y_Belleza_Blanco from './logo_salud_y_belleza_blanco.png';
//import { Fondo } from './components/Fondo';

function App() {
  return (
    <div className="App">
        <section className="App-logo">
          <img src={logo_Salud_y_Belleza_Blanco} className="App-logo2" alt="logo" />
        </section>
        <section className="Info">
          <p> 
            Bienvenido a Salud y Belleza, la mejor tienda de productos de belleza 
            y cuidado personal.  
          </p>
        </section>
        <section className="Info">
          <p>
            En nuestra tienda encontrarás una amplia variedad de productos de alta calidad para el cuidado de tu piel, cabello y cuerpo.
          </p>
        </section>
      
    </div>
  );
}

export default App;
