import React from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

class LogOut extends React.Component{
    render(){
        this.props.setUser(null)
        localStorage.removeItem("token")
        return <Redirect to='/' />
    }
}

function msp(state){
    return {
      currentUser: state.userReducer.currentUser
    }
}

export default connect(msp, { setUser })(LogOut)
