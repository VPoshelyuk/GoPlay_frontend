import React, {Fragment} from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

class GroupCard extends React.Component{

    render(){
        return (
        <div onClick={this.joinTeam} className="team_card">
            <h1 className="team_name">{this.props.group.name}</h1>
            <p className="team_location">{this.props.group.location}</p>
            <img className="team_logo" src={this.props.group.logo_path} />
            <h2 className="team_desc">{this.props.group.description}</h2>
        </div>
        );
    }
}

function msp(state){
    return {
        currentUser: state.userReducer.currentUser,
        sportId: state.teamReducer.currentSportId
    }
}

export default connect(msp, { setUser })(GroupCard)