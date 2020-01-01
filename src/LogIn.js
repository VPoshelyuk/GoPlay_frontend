import React from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser, setMyTeams, setMyGroups } from './redux/actions/user_actions'

class LogIn extends React.Component{
  state = {
      username: "",
      password: ""
  }

  handleChange = (event) => {
      this.setState({
        [event.target.name]: event.target.value
      })
  }

  handleSubmit = (e) => {
      e.preventDefault()
      fetch("http://localhost:3000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(this.state)
      })
      .then(res => res.json())
      .then(response => {
        if (response.errors){
          alert(response.errors)
        } else {
          this.props.setUser(response)
          localStorage.token = response.token
          this.setState({
            username: "",
            password: ""
          })
        }
      })
    }

    render(){
        if (this.props.currentUser !== null) {
          console.log(this.props.myTeams)
            return <Redirect to='/dashboard' />;
        } 
        return (
        <div className="login-main">
          <img className="login_logo" src="./images/nav_logo.png" alt="logo"/>
          <form onSubmit={this.handleSubmit} className='form'>
          <p className='field required'>
              <label className='label' htmlFor='username'>Username</label>
              <input className='text-input' id='username' name='username' value={this.state.username} onChange={this.handleChange} required type='username' />
          </p>
          <p className='field required'>
              <label className='label' htmlFor='password'>Password</label>
              <input className='text-input' id='password' name='password' value={this.state.password} onChange={this.handleChange} required type='password'/>
          </p>
          <p className='field'>
          </p>
          <p className='field'>
              <input className='button' type='submit' value='Log In' />
          </p>
          </form>
        </div>
        );
    }
}

function msp(state){
  return {
    currentUser: state.userReducer.currentUser,
    myTeams: state.userReducer.myTeams
  }
}

export default connect(msp, { setUser, setMyTeams, setMyGroups})(LogIn)
