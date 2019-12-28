import React from "react";
import MaskedInput from 'react-maskedinput'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

class SignUp extends React.Component{
    state = {
        first_name: "",
        profile_pic: null,
        last_name: "",
        username: "",
        location: "",
        email: "",
        phone_number: "",
        birthday: "",
        gender: "",
        bio: "",
        won_games: 0,
        tie_games: 0,
        lost_games: 0,
        admin: 0,
        activity_ids: [],
        password: "",
        passwordConfirmation: "",
        loaded: false
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })
    }

    handleDateChange = (event) => {
        let value = event.target.value;       
        event.target.value = value.replace(/^([\d]{2})([\d]{2})([\d]{4})$/,"$1/$2/$3");        
        this.setState({
          [event.target.name]: event.target.value
        })
    }
    
    addPic = (e) => {
        // console.log(e.target.files)
        this.setState({
            profile_pic: e.target.files[0],
        });
    }
    
    addActivities = (event) => {
        if(this.state.activity_ids.find(el => el === event.target.value)){
            this.setState({
                activity_ids: this.state.activity_ids.filter(el => el !== event.target.value)
            })
        }else{
            this.setState({
                activity_ids: [...this.state.activity_ids, event.target.value]
            })
        }
    }

    
    handleSubmit = (e) => {
        e.preventDefault()
        const fD = new FormData()
        fD.append("first_name", this.state.first_name)
        fD.append("last_name", this.state.last_name)
        fD.append("username", this.state.username)
        fD.append("profile_pic", this.state.profile_pic)
        fD.append("location", this.state.location)
        fD.append("email", this.state.email)
        fD.append("phone_number", this.state.phone_number)
        fD.append("birthday", this.state.birthday)
        fD.append("gender", this.state.gender)
        fD.append("bio", this.state.bio)
        fD.append("password", this.state.password)
        fD.append("admin", 0)
        fD.append("won_games", 0)
        fD.append("lost_games", 0)
        fD.append("tie_games", 0)
        console.log(this.state.profile_pic)
        if (this.state.password === this.state.passwordConfirmation){
            fetch("http://localhost:3000/api/v1/signup", {
            method: "POST",
            body: fD
            })
            .then(res => res.json())
            .then(response => {
                if(response.errors){
                    alert(response.errors)
                } else {
                    let token = response.token
                    fetch("http://localhost:3000/api/v1/user_activities", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            user_id: response.user.data.attributes.id,
                            sports: this.state.activity_ids
                        })
                    })
                    .then(
                        setTimeout(() => {
                            fetch("http://localhost:3000/api/v1/auto_login", {
                                headers: {
                                "authorization": token
                                }
                            })
                            .then(res => res.json())
                            .then(user =>{
                                if (user.errors){
                                alert(user.errors)
                                } else {
                                this.props.setUser(user)
                                localStorage.token = user.token
                                this.setState({
                                    first_name: "",
                                    last_name: "",
                                    username: "",
                                    location: "",
                                    email: "",
                                    phone_number: "",
                                    birthday: "",
                                    gender: "",
                                    bio: "",
                                    admin: 0,
                                    activity_ids: [],
                                    password: "",
                                    passwordConfirmation: "",
                                    loaded: true
                                })
                                }
                            })
                        }, 1000)
                    )
                }
                })
        } else {
            alert("Passwords don't match!")
        }

    }

    componentDidMount(){
        if(this.props.email !== "" && this.props.password !== ""){
            this.setState({
                email: this.props.email,
                password: this.props.password,
                passwordConfirmation: this.props.password
            })
        }
    }

    render(){
        if(this.props.currentUser !== null){
            return <Redirect to='/dashboard' />
        }
        return (
        <div className="signup-main">
            <form onSubmit={this.handleSubmit} className='form'>
            <p className='field required half'>
                <label className='label required' htmlFor='first_name'>First name</label>
                <input className='text-input' id='first_name' name='first_name' value={this.state.first_name} onChange={this.handleChange} required type='text'/>
            </p>
            <p className='field required half'>
                <label className='label required' htmlFor='last_name'>Last name</label>
                <input className='text-input' id='last_name' name='last_name' value={this.state.last_name} onChange={this.handleChange} required type='text'/>
            </p>
            <p className='field required half'>
                <label className='label' htmlFor='username'>Username</label>
                <input className='text-input' id='username' name='username' value={this.state.username} onChange={this.handleChange} required type='username' />
            </p>
            <p className='field required half'>
                <label className='label' htmlFor='select'>Location</label>
                <select className='select' value={this.state.location} onChange={this.handleChange} name="location" id='select'>
                <option value=''></option>
                <option value='New York, NY'>New York, NY</option>
                <option value='Los Angeles, CA'>Los Angeles, CA</option>
                <option value='Miami, FL'>Miami, FL</option>
                </select>
            </p>
            <p className='field required half'>
                <label className='label' htmlFor='email'>E-mail</label>
                <input className='text-input' id='email' name='email' value={this.state.email} onChange={this.handleChange} required type='email' />
            </p>
            <p className='field required half'>
                <label className='label' htmlFor='phone_number'>Phone</label>
                <input className='text-input' id='phone_number' name='phone_number' value={this.state.phone_number} onChange={this.handleChange} type='phone'/>
            </p>
            <p className='field half required'>
                <label className='label' htmlFor='birthday'>Birthday</label>
                <MaskedInput mask="11/11/1111" className='text-input' id='birthday' name='birthday' placeholder="mm/dd/yyyy" value={this.state.birthday} onChange={this.handleDateChange} required type='text' />
                {/* <input className='text-input' id='birthday' name='birthday' placeholder="mm/dd/yyyy" value={this.state.birthday} onChange={this.handleDateChange} required type='text' /> */}
            </p>
            <p className='field half required'>
                <label className='label' htmlFor='gender'>Gender</label>
                <input className='text-input' id='gender' name='gender' value={this.state.gender} onChange={this.handleChange} required type='gender'/>
            </p>
            <p className='field required'>
                <label className='label' htmlFor='profile_pic'>Profile Picture</label>
                <input className='text-input' id='profile_pic' name='profile_pic' onChange={this.addPic} accept="image/*" required type='file'/>
            </p>
            <div className='field required'>
                <label className='label'>Choose your sports:</label>
                <ul className='checkboxes'>
                <li className='checkbox'>
                    <input onChange={this.addActivities} className='checkbox-input' id='choice-1' name='choice' type='checkbox' value='1' />
                    <label className='checkbox-label' htmlFor='choice-1'>Soccer</label>
                </li>
                <li className='checkbox'>
                    <input onChange={this.addActivities} className='checkbox-input' id='choice-2' name='choice' type='checkbox' value='2' />
                    <label className='checkbox-label' htmlFor='choice-2'>Football</label>
                </li>
                <li className='checkbox'>
                    <input onChange={this.addActivities} className='checkbox-input' id='choice-3' name='choice' type='checkbox' value='3' />
                    <label className='checkbox-label' htmlFor='choice-3'>Basketball</label>
                </li>
                <li className='checkbox'>
                    <input onChange={this.addActivities} className='checkbox-input' id='choice-4' name='choice' type='checkbox' value='4' />
                    <label className='checkbox-label' htmlFor='choice-4'>Volleyball</label>
                </li>
                <li className='checkbox'>
                    <input onChange={this.addActivities} className='checkbox-input' id='choice-5' name='choice' type='checkbox' value='5' />
                    <label className='checkbox-label' htmlFor='choice-5'>Baseball</label>
                </li>
                <li className='checkbox'>
                    <input onChange={this.addActivities} className='checkbox-input' id='choice-6' name='choice' type='checkbox' value='6' />
                    <label className='checkbox-label' htmlFor='choice-6'>Ice Hockey</label>
                </li>
                </ul>
            </div>
            <p className='field'>
                <label className='label' htmlFor='bio'>Bio</label>
                <textarea className='textarea' cols='50' id='bio' name='bio' value={this.state.bio} onChange={this.handleChange} rows='4'></textarea>
            </p>
            <p className='field half required'>
                <label className='label' htmlFor='password'>Password</label>
                <input className='text-input' id='password' name='password' value={this.state.password} onChange={this.handleChange} required type='password'/>
            </p>
            <p className='field half required'>
                <label className='label' htmlFor='passwordConfirmation'>Password Confirmation</label>
                <input className='text-input' id='passwordConfirmation' name='passwordConfirmation' value={this.state.passwordConfirmation} onChange={this.handleChange} required type='passwordConfirmation'/>
            </p>
            <p className='field'>
                <input className='button' type='submit' value='Sign Up' />
            </p>
            </form>
        </div>
        );
    }
}

function msp(state){
    return {
      currentUser: state.userReducer.currentUser,
      email: state.userReducer.email,
      password: state.userReducer.password
    }
}

export default connect(msp, { setUser })(SignUp)
