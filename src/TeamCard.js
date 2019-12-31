import React from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

class TeamSearch extends React.Component{
    state = {
        joined: false
    }

    joinTeam = () => {
        fetch("http://localhost:3000/api/v1/user_teams", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                user_id: this.props.currentUser.user.data.id,
                team_id: this.props.team.id,
                signup_won_games: this.props.team.won_games,
                signup_tie_games: this.props.team.tie_games,
                signup_lost_games: this.props.team.lost_games
            })
        })
        fetch(`http://localhost:3000/api/v1/teams/${this.props.team.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                number_of_members: this.props.team.number_of_members + 1
            })
        })
        .then(
            setTimeout(() => {
                fetch("http://localhost:3000/api/v1/auto_login", {
                    headers: {
                    "authorization": localStorage.token
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
                        joined: true
                    })
                    }
                })
            }, 1000)
        )
    }

    render(){
        if(this.state.joined) return <Redirect to="/dashboard" />
        return (
        <div onClick={this.props.profile_acc? null : this.joinTeam} className="team_card">
            <h1 className="team_name">{this.props.team.name}</h1>
            <p className="team_location">{this.props.team.location}</p>
            <p className="team_mem_num">{this.props.team.number_of_members}</p>
            <img className="team_logo" src={this.props.team.logo_path} alt="team_logo" />
            <h2 className="team_desc">{this.props.team.description}</h2>
            <div className="team_scores">
                <p className="team_score">{this.props.team.won_games}</p>
                <p className="team_score">{this.props.team.tie_games}</p>
                <p className="team_score">{this.props.team.lost_games}</p>
            </div>
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

export default connect(msp, { setUser })(TeamSearch)