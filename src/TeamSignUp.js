import React, {Fragment} from "react";
import { Redirect, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

class TeamSignUp extends React.Component{
    state = {
        name: "",
        logo_path: "",
        description: "",
        created: false
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
            fetch("http://localhost:3000/api/v1/teams", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: this.state.name,
                location: this.props.currentUser.user.data.attributes.location,
                number_of_members: 1,
                logo_path: this.state.logo_path,
                description: this.state.description,
                won_games: 0,
                tie_games: 0,
                lost_games: 0,
                admin_id: this.props.currentUser.user.data.id,
                activity_id: this.props.sportId
            })
            })
            .then(res => res.json())
            .then(response => {
                console.log(response)
                fetch("http://localhost:3000/api/v1/user_teams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    user_id: this.props.currentUser.user.data.id,
                    team_id: response.team.data.id,
                    signup_won_games: response.team.data.attributes.won_games,
                    signup_tie_games: response.team.data.attributes.tie_games,
                    signup_lost_games: response.team.data.attributes.lost_games
                })
                })
                .then(res => res.json())
                .then(response => {
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
                                name: "",
                                logo_path: "",
                                description: "",
                                created: true
                            })
                            }
                        })
                    }, 1000)
                })
            })
    }

    componentDidMount(){
    }
      
    

    render(){
        if(this.state.created) return <Redirect to="/dashboard" />
        return (
        <div className="dash_main">
            <form onSubmit={this.handleSubmit} className='form'>
            <p className='field required half'>
                <label className='label required' htmlFor='name'>Name</label>
                <input className='text-input' id='name' name='name' value={this.state.name} onChange={this.handleChange} required type='text'/>
            </p>
            <p className='field required half'>
                <label className='label' htmlFor='logo_path'>Logo</label>
                <input className='text-input' id='logo_path' name='logo_path' value={this.state.logo_path} onChange={this.handleChange} required type='logo_path' />
            </p>
            <p className='field'>
                <label className='label' htmlFor='description'>Description</label>
                <textarea className='textarea' cols='50' id='description' name='description' value={this.state.description} onChange={this.handleChange} rows='4'></textarea>
            </p>
            <p className='field'>
                <input className='button' type='submit' value='Create a team' />
            </p>
            </form>
            <NavLink to="/dashboard" className="main_text">Go back to dashboard...</NavLink>
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

export default connect(msp, { setUser })(TeamSignUp)