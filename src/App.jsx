import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     
    
//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";                                         
        

import AppRouter from './shared/components/AppRouter';
import FondoDePantalla from './shared/components/fondo/FondoDePantalla';
function App() {
  return (
    <div className="App">
      <FondoDePantalla/>
     <AppRouter/>
    </div>
  );
}

export default App;
