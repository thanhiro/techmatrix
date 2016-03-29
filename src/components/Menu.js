import React from 'react';

const Menu = () => (
  <div>
    <a href='#menu' id='menuLink' className='menu-link'>
      <span></span>
    </a>
    <div id='menu'>
      <div className='pure-menu'>
        <a className='pure-menu-heading' href='#'>Arcusys</a>

        <ul className='pure-menu-list'>
          <li className='pure-menu-item pure-menu-selected'><a href='#' className='pure-menu-link'>The list</a></li>
          <li className='pure-menu-item'><a href='#' className='pure-menu-link'>About</a></li>
        </ul>
      </div>
    </div>
  </div>
);

export default Menu;
