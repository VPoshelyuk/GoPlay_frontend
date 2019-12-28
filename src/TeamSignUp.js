import React from "react";
import { Redirect, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser, setMyTeams } from './redux/actions/user_actions'

class TeamSignUp extends React.Component{
    state = {
        name: "",
        logo: "",
        description: "",
        created: false
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })
    }

    addPic = (e) => {
        // console.log(e.target.files)
        this.setState({
            logo: e.target.files[0],
        });
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const fD = new FormData()
        fD.append("name", this.state.name)
        fD.append("location", this.props.currentUser.user.data.attributes.location)
        fD.append("number_of_members", 1)
        fD.append("logo", this.state.logo)
        fD.append("description", this.state.description)
        fD.append("admin_id", this.props.currentUser.user.data.id)
        fD.append("activity_id", this.props.sportId)
        fD.append("won_games", 0)
        fD.append("lost_games", 0)
        fD.append("tie_games", 0)
            fetch("http://localhost:3000/api/v1/teams", {
            method: "POST",
            body: fD
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
                    fetch("http://localhost:3000/api/v1/my_teams", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            user_id: this.props.currentUser.user.data.id
                        })
                    })
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
                            .then(res => res.json())
                            .then(teams => {this.props.setMyTeams(teams.teams.data)})
                            .catch(() => this.props.setMyTeams(undefined))
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
                <input className='text-input' id='logo_path' name='logo_path' onChange={this.addPic} accept="image/*" required type='file' />
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

export default connect(msp, { setUser, setMyTeams })(TeamSignUp)