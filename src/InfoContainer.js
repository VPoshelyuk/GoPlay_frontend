import React from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { passEmailAndPass } from './redux/actions/user_actions'

class InfoContainer extends React.Component{
    state={
        redirected: false
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.passEmailAndPass(e.target.querySelectorAll("input")[0].value, e.target.querySelectorAll("input")[1].value)
        this.setState({
            redirected: true
        })
    }

    render(){
        if(this.state.redirected){
            this.setState({
                redirected: false
            })
            return <Redirect to='/signup' />
            //Fix render error!!!
        }
        return (
            <div className="main">   
                <div className="signup_element">
                    <h3 className="main_text">Find teammates for your next game.</h3>
                    <h3 className="main_text">Create a new team.</h3>
                    <h3 className="main_text">Find people to join your team.</h3>
                    <h3 className="main_text">Everything and much more can be done</h3>
                    <h3 className="main_text">with GoPlay.</h3>
                    <h3 className="signup_text">Sign Up today:</h3>
                    <form onSubmit={this.handleSubmit} className='form'>
                        <p className='field required'>
                            <label className='label required' htmlFor='first_name'>E-mail</label>
                            <input className='text-input' id='first_name' name='first_name' required type='text'/>
                        </p>
                        <p className='field required'>
                            <label className='label required' htmlFor='password'>Password</label>
                            <input className='text-input' id='password' name='password' required type='password'/>
                        </p>
                        <p className='field'>
                            <input className='button' type='submit' value='Sign Up' />
                        </p>
                    </form>
                </div>
                <div className="video_element">
                        <video className="video" height="700" autoPlay loop muted>
                            <source src="./videos/goplay.mp4" type="video/mp4"></source>
                            Your browser does not support the video tag.
                        </video>
                </div>
            </div>
        );
    }
}

function msp(state){
    return {
      email: state.userReducer.email,
      password: state.userReducer.password
    }
}

export default connect(msp, { passEmailAndPass })(InfoContainer)