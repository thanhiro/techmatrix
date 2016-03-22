import React, {PropTypes} from 'react'

const Menu = () => (
  <div>
    <a href="#menu" id="menuLink" className="menu-link">
      <span></span>
    </a>
    <div id="menu">
      <div className="pure-menu">
        <a className="pure-menu-heading" href="#">Company</a>

        <ul className="pure-menu-list">
          <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
          <li className="pure-menu-item"><a href="#" className="pure-menu-link">About</a></li>

          <li className="pure-menu-item" className="menu-item-divided pure-menu-selected">
            <a href="#" className="pure-menu-link">Services</a>
          </li>

          <li className="pure-menu-item"><a href="#" className="pure-menu-link">Contact</a></li>
        </ul>
      </div>
    </div>
  </div>
);

//Todo.propTypes = {}

export default Menu
