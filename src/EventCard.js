import React, { Fragment } from "react";
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

class EventCard extends React.Component{

    state= {
        status: undefined,
        user_event: undefined,
        added: false,
        viewed: false
    }

    handleParticipateInEvent = () => {
        fetch("http://localhost:3000/api/v1/team_events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                event_id: this.props.event.id,
                team_id: this.props.myTeam.id
            })
            })
        .then(res => res.json())
        .then(() =>{

            this.setState({
                added: true
            })
        }
        )
    }

    setAttendance = e => {
        fetch(`http://localhost:3000/api/v1/user_events/${this.state.user_event}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                event_id: this.props.event.id,
                user_id: this.props.currentUser.user.data.attributes.id,
                status: e.target.value
            })
        })
        .then(console.log)
    }

    componentDidMount(){
        if(this.props.status_check === 1 && this.props.myTeam.attributes.events.find(event => event.id === this.props.event.id)){
            fetch("http://localhost:3000/api/v1/status_check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                event_id: this.props.event.id,
                user_id: this.props.currentUser.user.data.attributes.id
            })
            })
            .then(res => res.json())
            .then((resp) =>
                this.setState({
                    status: resp.status,
                    user_event: resp.id
                },()=>{
                    const selector = document.querySelectorAll('input[name="selector"]')
                    switch (resp.status) {
                        case 'Going':
                            selector[0].checked = true
                            break;
                        case 'Maybe':
                            selector[1].checked = true
                            break;
                        case 'Nope':
                            selector[2].checked = true
                            break;
                        default:
                            break;
                    }
                    selector.value = resp.status
                    console.log(selector.value)
                })
            )
        }else{
            this.setState({
                status: null
            })
        }
    }

    // handleViewEvent = () => {
    //     // this.props.setevent(this.props.event)
    //     this.setState({
    //         viewed: true
    //     })
    // }

    render(){
        console.log(this.props, this.state)
        if(this.state.added && this.props.myGroup)return <Redirect to="/dashboard" />
        // if(this.state.viewed){
        //     this.setState({
        //         viewed: false
        //     })
        //     return <Redirect to={`/event/${this.props.event.id}`} />
        // }
        // debugger
        return (
        <div className="team_card">
            <h1 className="team_name">{this.props.event.name}</h1>
            <p className="team_location">{this.props.event.price === 0 ? "Free" : this.props.event.price}</p>
            <img className="team_logo" src={this.props.event.pic_path} alt="event_pic" />
            <h2 className="team_desc">{this.props.event.description}</h2>
            <p className="team_location">{this.props.event.players_per_team}</p>
            <p className="team_location">{this.props.event.max_number_of_teams}</p>
            <p className="team_location">{this.props.event.pretty_time}</p>
            {this.props.myTeam !== undefined && this.props.myTeam !== null?
                this.props.myTeam.attributes.events === undefined || this.props.myTeam.attributes.events.find(event => event.id === this.props.event.id) === undefined?
                    <button onClick={this.handleParticipateInEvent} style={{marginTop: "50px"}} className='dash_button'>Count my team in!</button>
                    :
                    this.props.myTeam.attributes.events.find(event => event.id === this.props.event.id) && this.props.myTeam.attributes.admin.id === this.props.currentUser.user.data.attributes.id?
                        <Fragment>
                            <div onChange={this.setAttendance} name="radio" className="radio-group">
                                <input type="radio" id="option-one" value="Going" name="selector" />
                                <label htmlFor="option-one">I'm Going!</label>
                                <input type="radio" id="option-two" value="Maybe" name="selector" />
                                <label htmlFor="option-two">Maybe</label>
                                <input type="radio" id="option-three" value="Nope" name="selector" />
                                <label htmlFor="option-three">Nope</label>
                            </div>
                            <button onClick={this.handleUnparticipateInEvent} style={{marginTop: "50px"}} className='dash_button'>Sorry, my team can't make it</button>
                        </Fragment>
                        :
                        <button onClick={this.handleChangeMyStatusOnEvent} style={{marginTop: "50px"}} className='dash_button'>I'll go/maybe/no</button>
                :
                this.state.added ?
                    this.props.myTeam.attributes.admin.id === this.props.currentUser.user.data.attributes.id?
                        <Fragment>
                            <div onChange={this.setAttendance} name="radio" className="radio-group">
                                <input type="radio" id="option-one" name="selector" />
                                <label htmlFor="option-one">I'm Going!</label>
                                <input type="radio" id="option-two" name="selector" />
                                <label htmlFor="option-two">Maybe</label>
                                <input type="radio" id="option-three" name="selector" />
                                <label htmlFor="option-three">Nope</label>
                            </div>
                            <button onClick={this.handleUnparticipateInEvent} style={{marginTop: "50px"}} className='dash_button'>Sorry, my team can't make it</button>
                        </Fragment>
                        :
                        <button onClick={this.handleChangeMyStatusOnEvent} style={{marginTop: "50px"}} className='dash_button'>I'll go/maybe/no</button>
                    :
                    null

            }
        </div>
        );
    }
}

function msp(state){
    return {
        currentUser: state.userReducer.currentUser,
        myTeam: state.teamReducer.currentTeam,
        myGroup: state.teamReducer.currentGroup
        // sportId: state.teamReducer.currentSportId
    }
}

export default connect(msp)(EventCard)