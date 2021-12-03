import logo from './logo.svg';
import Login from "./components/Form/Login"
import './App.css';
import { useState } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Products from './components/Products';

function App() {

  const [isLoggedIn, setLogin] = useState(true)
  return (
    <div className="App">
    
      {isLoggedIn === false && <Login />}
      {isLoggedIn === true && <Products />}
      
    </div>
  );
}

export default App;
