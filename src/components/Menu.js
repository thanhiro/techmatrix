import React from 'react';

const Menu = () => (
  <div>
    <a href='#menu' id='menuLink' className='menu-link'>
      <span></span>
    </a>
    <div id='menu'>
      <div className='pure-menu'>
        <a className='pure-menu-heading' href='#'>
          <i className='icon-cog-outline' />
          <span>Tech</span>matrix</a>

        <ul className='pure-menu-list'>
          <li className='pure-menu-item pure-menu-selected'><a href='#' className='pure-menu-link'>
            <i className='icon-list' /> The list</a></li>
          <li className='pure-menu-item'><a href='#' className='pure-menu-link'>
            <i className='icon-info-circled' /> About</a></li>
          <li className='pure-menu-item'><a href='#' className='pure-menu-link'>
            <i className='icon-chart-bar' /> Stats</a></li>
        </ul>
      </div>
    </div>
  </div>
);

export default Menu;
