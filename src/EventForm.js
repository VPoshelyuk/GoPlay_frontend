import React from "react";
// import MaskedInput from 'react-maskedinput'
import DateTimePicker from 'react-datetime-picker'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'

class EventForm extends React.Component{
    state = {
        name: "",
        e_logo: null,
        price: "Free",
        time: "",
        players_per_team: "",
        max_number_of_teams: "",
        description: "",
        address: "",
        loaded: false,
        added: false
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })
    }
    
    addPic = (e) => {
        // console.log(e.target.files)
        this.setState({
            e_logo: e.target.files[0],
        });
    }


    
    handleSubmit = (e) => {
        e.preventDefault()
        const fD = new FormData()
        fD.append("name", this.state.name)
        fD.append("price", "Free")
        fD.append("time", this.state.time)
        fD.append("e_logo", this.state.e_logo)
        fD.append("players_per_team", this.state.players_per_team)
        fD.append("max_number_of_teams", this.state.max_number_of_teams)
        fD.append("description", this.state.description)
        fD.append("address", this.state.address)
        fD.append("group_id", this.props.myGroup.id)
        console.log(this.state.max_number_of_teams)
        fetch("http://localhost:3000/api/v1/events", {
            method: "POST",
            body: fD
            })
            .then(res => res.json())
            .then(response => this.setState({added: true}))
    }

    // componentDidMount(){
    // }

    render(){
        if(this.state.added){
            this.setState({added: false})
            return <Redirect to={`/group/${this.props.myGroup.id}`} />
        }
        return (
        <div className="signup-main">
            <form onSubmit={this.handleSubmit} className='form'>
            <p className='field required '>
                <label className='label required' htmlFor='name'>Name</label>
                <input className='text-input' id='name' name='name' value={this.state.name} onChange={this.handleChange} required type='text'/>
            </p>
            <p className='field required half'>
                <label className='label required' htmlFor='price'>Price</label>
                <input className='text-input' id='price' name='price' value={this.state.price} onChange={this.handleChange} required type='text'/>
            </p>
            <div className='field required half'>
                <label className='label'>Time of the Event</label>
                <DateTimePicker
                    required={true}
                    className='text-input datetime'
                    disableClock={true}
                    onChange={time => this.setState({ time })}
                    value={this.state.time}
                />
                {/* <input className='text-input' id='time' name='time' value={this.state.time} onChange={this.handleChange} required type='time' /> */}
            </div>
            <p className='field required half'>
                <label className='label' htmlFor='players_per_team'>Players Per Team</label>
                <input className='text-input' id='players_per_team' name='players_per_team' value={this.state.players_per_team} onChange={this.handleChange} required type='number' min="2" max="15" />
            </p>
            <p className='field required half'>
                <label className='label' htmlFor='max_number_of_teams'>Max Team Number</label>
                <input className='text-input' id='max_number_of_teams' name='max_number_of_teams' value={this.state.max_number_of_teams} onChange={this.handleChange} type='number' min="2" max="32"/>
            </p>
            <p className='field half required'>
                <label className='label' htmlFor='e_logo'>Event Picture</label>
                <input className='text-input' id='e_logo' name='e_logo' onChange={this.addPic} accept="image/*" required type='file'/>
            </p>
            <p className='field half'>
                <label className='label' htmlFor='address'>Address</label>
                <input className='text-input' cols='50' id='address' name='address' value={this.state.address} onChange={this.handleChange} />
            </p>
            <p className='field'>
                <label className='label' htmlFor='description'>Description</label>
                <textarea className='textarea' cols='50' id='description' name='description' value={this.state.description} onChange={this.handleChange} rows='4'></textarea>
            </p>
            <p className='field'>
                <input className='button' type='submit' value='Create' />
            </p>
            </form>
        </div>
        );
    }
}

function msp(state){
    return {
      currentUser: state.userReducer.currentUser,
      myTeams: state.userReducer.myTeams,
      myTeam: state.teamReducer.currentTeam,
      myGroup: state.teamReducer.currentGroup,
      password: state.userReducer.password
    }
}

export default connect(msp, { setUser })(EventForm)
