/* @flow */
import React from 'react';

export default class Login extends React.Component {
  constructor() {
    this.state = {
      user: '',
      password: ''
    };
  }

  login(e) {
    e.preventDefault();
  }

  render() {
    return (
      <form role='form'>
        <div className='form-group'>
          <input type='text' value={this.state.user}
                 placeholder='Username' />
          <input type='password' value={this.state.password}
                 placeholder='Password' />
        </div>
        <button type='submit' onClick={this.login.bind(this)}>Submit</button>
      </form>
    );
  }
}
