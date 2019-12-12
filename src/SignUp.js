import React from "react";
import { Redirect } from 'react-router-dom'

export default class SignUp extends React.Component{
    state = {
        fname: "",
        lname: "",
        phonenumber: "",
        username: "",
        password: "",
        passwordConfirmation: ""
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })
      }
    
    handleSubmit = (e) => {
        e.preventDefault()
        if (this.state.password === this.state.passwordConfirmation){
            fetch("http://localhost:3000/api/v1/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state)
            })
            .then(res => res.json())
            .then(response => {
            if(response.errors){
                alert(response.errors)
            } else {
                this.props.setUser(response)
                this.setState({
                    fname: "",
                    lname: "",
                    phonenumber: "",
                    username: "",
                    password: "",
                    passwordConfirmation: ""
                })
            }
            })
        } else {
            alert("Passwords don't match!")
        }

    }
    

    render(){
        if (this.props.currentUser !== null && this.props.currentUser !== undefined) {
            return <Redirect to='/' />;
        } 
        return (
            <div className="signup-main">
            <p className="sign" align="center" >Sign Up</p>
            <form className="form1" onSubmit={this.handleSubmit}>
                <input className="un" type="text" align="center" name="fname" value={this.state.fname} onChange={this.handleChange} placeholder="First Name" />
                <input className="un" type="text" align="center" name="lname" value={this.state.lname} onChange={this.handleChange} placeholder="Last Name" />
                <input className="un" type="text" align="center" name="phonenumber" value={this.state.phonenumber} onChange={this.handleChange} placeholder="Phone Number" />
                <input className="un" type="text" align="center" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" />
                <input className="pass" type="password" align="center" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                <input className="pass" type="password" align="center" name="passwordConfirmation" value={this.state.passwordConfirmation} onChange={this.handleChange} placeholder="Password Confirmation" />
                <input className="submit" align="center" type="submit" value="Sign Up" />
            </form>
        </div>
        );
    }
}
