import React, {Fragment} from "react";
import { Redirect, NavLink, Link } from 'react-router-dom'
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
        this.props.team.events.forEach(event =>
            fetch("http://localhost:3000/api/v1/user_events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                user_id: this.props.currentUser.user.data.id,
                event_id: event.id
            })
            })
        )
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
        console.log(this.props)
        if(this.state.joined) return <Redirect to="/dashboard" />
        return (
        <Fragment>
                {
                    this.props.dash_style?
                    <NavLink to={`/dashboard`}>
                        <figure style={{backgroundImage: `url(${this.props.team.logo_path})`}}>
                            <figcaption>
                                <h4> <span>{this.props.team.name}</span></h4>
                                {/* <h4> <span>{this.props.team.location}</span></h4> */}
                                <p>{this.props.team.location}</p>
                            </figcaption>
                        </figure>
                    </NavLink>
                    :
                    <div onClick={this.props.profile_acc? null : this.joinTeam} className="team_card">
                        <div className="group_logo_div">
                            <img className="group_logo" src={this.props.team.logo} alt="team_logo" />
                            <p className="group_location">{this.props.team.location}</p>
                            <p className="team_mem_num">Number of members:{this.props.team.number_of_members}</p>
                            {this.props.team.users.length !== 0 ?
                                <Fragment>
                                {this.props.team.users.length > 5 ?
                                    <div className="avatars">
                                        {this.props.team.users.sort(() => 0.5 - Math.random()).slice(0, 4).map(user => <span className="avatar" ><img  src={user.profile_pic_path} title={user.username} /></span>)}
                                        <span className="avatar" style={{backgroundColor: "#E8474C"}} title="More users"><h1>+{this.props.team.users.length - 4}</h1></span>
                                    </div>
                                    :
                                    <div className="avatars">
                                        {this.props.team.users.sort(() => 0.5 - Math.random()).map(user => <span className="avatar"><Link to={`/users/@${user.id}`}><img  src={user.profile_pic_path} title={user.username} /></Link></span>)}
                                    </div>
                                }
                                </Fragment>
                                :
                                null
                            }
                            <div className="team_scores">
                                <p className="team_score">Games won: {this.props.team.won_games}</p>
                                <p className="team_score">Ties: {this.props.team.tie_games}</p>
                                <p className="team_score">Games lost: {this.props.team.lost_games}</p>
                            </div>
                        </div>
                        <div className="group_info_div">
                            <h1 className="group_name">{this.props.team.name}</h1>
                            <h2 className="group_desc">{this.props.team.description}</h2>
                        </div>
                        {this.props.add === 1 ?
                        <Fragment>
                            <button onClick={this.handleAddGroup} style={{marginTop: "20px", width: "70%", marginRight: "2.5%"}} className='dash_button'>Join Team</button>
                        </Fragment>
                        :
                        null
                        }
                    </div>
                }
            </Fragment>
        );
        // <div onClick={this.props.profile_acc? null : this.joinTeam} className="regular_card">
        //     <h1 className="team_name">{this.props.team.name}</h1>
        //     <p className="team_location">{this.props.team.location}</p>
        //     <p className="team_mem_num">{this.props.team.number_of_members}</p>
        //     <img className="team_logo" src={this.props.team.logo_path} alt="team_logo" />
        //     <h2 className="team_desc">{this.props.team.description}</h2>
        //     <div className="team_scores">
        //         <p className="team_score">{this.props.team.won_games}</p>
        //         <p className="team_score">{this.props.team.tie_games}</p>
        //         <p className="team_score">{this.props.team.lost_games}</p>
        //     </div>
        // </div>
        // );
    }
}

function msp(state){
    return {
        currentUser: state.userReducer.currentUser,
        sportId: state.teamReducer.currentSportId
    }
}

export default connect(msp, { setUser })(TeamSearch)