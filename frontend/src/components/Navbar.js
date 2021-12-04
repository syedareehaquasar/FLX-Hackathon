import React from "react";
import "./Navbar.css"

function Navbar() {

  return (

    <div>

      <nav className="menu">
        <input className="menu-toggler" type="checkbox" />
        <label for="menu-toggler"></label>
        <ul>
          <li className="menu-item">
            <a href=""></a>
          </li>
          <li className="menu-item">
            <a href="#"></a>
          </li>
          <li className="menu-item">
            <a href="#"></a>
          </li>
          <li className="menu-item">
            <a href="#"></a>
          </li>

        </ul>
      </nav>
    </div>
  )
}

export default Navbar
