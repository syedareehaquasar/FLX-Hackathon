import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import Login from "./components/Form/Login"
import './App.css';
import { useState } from 'react';

import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Products from './components/Products';
import FormLogin from "./components/Form/signUp";


function App() {

  const [isLoggedIn, setLogin] = useState(false)
  return (
    
     
      <div>

        <Login />

      </div>


    

  );
}

export default App;
