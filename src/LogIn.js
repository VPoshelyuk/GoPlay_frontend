import React from "react";
import { Redirect } from 'react-router-dom'

export default class LogIn extends React.Component{
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
            this.setState({
                username: "",
                password: ""
            })

          }
        })
    }

    render(){
        if (this.props.currentUser !== null) {
            return <Redirect to='/' />;
        } 
        return (
        <div className="login-main">
            <p className="sign" align="center" >Log In</p>
            <form className="form1" onSubmit={this.handleSubmit}>
                <input className="un" type="text" align="center" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" />
                <input className="pass" type="password" align="center" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                <input className="submit" align="center" type="submit" value="Log In" />
            </form>
        </div>
        );
    }
}
