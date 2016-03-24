import React, {PropTypes} from 'react';
import Menu from '../../components/Menu';
import '../../styles/core.scss';

// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of its props, so we can
// define it with a plain javascript function...
function CoreLayout({children}) {
  return (
    <div id='layout'>
      <Menu />

      <div id='main'>
        <div className='header'>
          <h1>TECHMATRIX</h1>
          <h2>Way to track tech in Arcusys</h2>
        </div>

        <div className='content'>
          <div className='pure-g'>
            <div className='pure-u-1-1'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CoreLayout.propTypes = {
  children: PropTypes.element
};

export default CoreLayout;
