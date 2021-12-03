import logo from './logo.svg';
import Login from "./components/Form/Login"
import './App.css';
import { useState } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Products from './components/Products';

function App() {

  const [isLoggedIn, setLogin] = useState(false)
  return (
    <div className="App">
      {/*isLoggedIn === false && <Login />*/}
      {/* <Products /> */}
      {/* <ProductCard /> */}
      <Login />
      
      {/* <Navbar /> */}
      
    </div>
  );
}

export default App;
