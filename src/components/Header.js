import React from 'react';
import * as classes from './Header.css';
import Logo from './Logo';

const Header = () => (
  <div className={classes.headerBar}>
    <div className='pure-g'>
      <div className='pure-u-2-3 pure-u-sm-3-3'>
        <div className='logo-header-container'>
          <Logo />
        </div>
      </div>
      <div className='pure-u-1-3 pure-u-sm-3-3'>

      </div>
    </div>
  </div>
);

export default Header;
