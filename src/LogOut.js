import React from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser, setMyTeams, setMyGroups } from './redux/actions/user_actions'

class LogOut extends React.Component{
    render(){
        this.props.setUser(null)
        this.props.setMyTeams(null)
        this.props.setMyGroups(null)
        localStorage.removeItem("token")
        return <Redirect to='/' />
    }
}

function msp(state){
    return {
      currentUser: state.userReducer.currentUser
    }
}

export default connect(msp, { setUser, setMyTeams, setMyGroups })(LogOut)
