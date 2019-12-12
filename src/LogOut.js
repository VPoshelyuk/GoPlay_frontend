import React from "react";
import { Redirect } from 'react-router-dom'

export default class LogOut extends React.Component{
    render(){
        this.props.logout()
        return <Redirect to='/' />
    }
}
