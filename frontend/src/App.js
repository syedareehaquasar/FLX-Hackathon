import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import Login from "./components/Form/Login"
import './App.css';
import { useState } from 'react';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Products from './components/Products';


function App() {

  const [isLoggedIn, setLogin] = useState(false)
  return (
<<<<<<< HEAD
    
     
      <div>

        <Login />

      </div>


    
=======
    <div className="App">
      {isLoggedIn === false && <Login />}
      {isLoggedIn === true && <Products />}
      
    </div>
>>>>>>> 01b2d928f9de61d46cbf993418d213c92638c422
  );
}

export default App;
