import React, { Fragment } from "react";
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { addEvent, addAvailableEvent } from './redux/actions/user_actions'
import { setTeam } from './redux/actions/team_actions'
var QRCode = require('qrcode.react');

class EventCard extends React.Component{

    state= {
        status: undefined,
        user_event: undefined,
        added: false,
        going: [],
        maybe: [],
        nope: [],
        clicked: false,
        viewed: false
    }

    handleClick = () => {
        this.setState({
            clicked: !this.state.clicked
        })
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
            this.props.setTeam(
                {...this.props.myTeam,
                    attributes: {
                    ...this.props.myTeam.attributes,
                    events: [...this.props.myTeam.attributes.events,this.props.event]
                 }
                }
            )
            this.props.addEvent(
                {attributes:{
                        ...this.props.event,
                        teams: [...this.props.event.teams,this.props.myTeam.attributes]
                    }
                })
            this.setState({
                added: true
            })
        }
        )
    }

    handleUnparticipateInEvent = () => {
        fetch("http://localhost:3000/api/v1/delete_by_team_event_ids", {
            method: "DELETE",
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
            this.props.setTeam(
                {...this.props.myTeam,
                    attributes: {
                    ...this.props.myTeam.attributes,
                    events: this.props.myTeam.attributes.events.filter(event => event.id !== this.props.event.id)
                 }
                }
            )
            this.props.addAvailableEvent(
                {attributes:{
                    ...this.props.event,
                    teams: [...this.props.event.teams,this.props.myTeam.attributes]
                    }
                })
            this.setState({
                added: true
            })
        }
        )
    }

    setAttendance = e => {
        switch (this.state.status) {
            case 'Going':
                this.setState({
                    going: this.state.going.filter(user => user.id !== this.props.currentUser.user.data.attributes.id)
                })
                break;
            case 'Maybe':
                this.setState({
                    maybe: this.state.maybe.filter(user => user.id !== this.props.currentUser.user.data.attributes.id)
                })
                break;
            case 'Nope':
                this.setState({
                    nope: this.state.nope.filter(user => user.id !== this.props.currentUser.user.data.attributes.id)
                })
                break;
            default:
                break;
        }
        switch (e.target.value) {
            case 'Going':
                this.setState({
                    going: [...this.state.going, this.props.currentUser.user.data.attributes],
                    status: e.target.value
                })
                break;
            case 'Maybe':
                this.setState({
                    maybe: [...this.state.maybe, this.props.currentUser.user.data.attributes],
                    status: e.target.value
                })
                break;
            case 'Nope':
                this.setState({
                    nope: [...this.state.nope, this.props.currentUser.user.data.attributes],
                    status: e.target.value
                })
                break;
            default:
                break;
        }
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
        .then(res => res.json())
        .then(console.log)
    }

    componentDidMount(){
        if(this.props.status_check === 1 && this.props.myTeam.attributes.events.find(event => event.id === this.props.event.id)){
            this.props.myTeam.attributes.users.forEach(user => {
                fetch("http://localhost:3000/api/v1/status_check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    event_id: this.props.event.id,
                    user_id: user.id
                })
                })
                .then(res => res.json())
                .then(resp => {
                    switch (resp.status) {
                        case 'Going':
                            this.setState({
                                going: [...this.state.going, user]
                            })
                            break;
                        case 'Maybe':
                            this.setState({
                                maybe: [...this.state.maybe, user]
                            })
                            break;
                        case 'Nope':
                            this.setState({
                                nope: [...this.state.nope, user]
                            })
                            break;
                        default:
                            break;
                    }
                })
                .then(() => {
                console.log(this.going)
                }

                )
            }
            )

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
                    if(this.state.going.length < this.props.event.players_per_team || this.state.going.find(user => user.id === this.props.currentUser.user.data.attributes.id)){
                        const selector = document.querySelectorAll(`input[name=selector${this.props.event.id}]`)
                        console.log(selector)
                        switch (resp.status) {
                            case 'Going':
                                selector[0].checked = "true"
                                break;
                            case 'Maybe':
                                selector[1].checked = "true"
                                break;
                            case 'Nope':
                                selector[2].checked = "true"
                                break;
                            default:
                                break;
                        }
                    }
                })
            )
        }else{
            this.setState({
                status: null
            })
        }
    }

    render(){
        console.log(this.props, this.state)
        if(this.state.added && this.props.myGroup)return <Redirect to="/dashboard" />
        return (
        <Fragment>
            {
                this.props.dash_style?
                <div>
                    <figure style={{backgroundImage: `url(${this.props.event.pic_path})`}}>
                        <figcaption>
                            <h4> <span>{this.props.event.name}</span></h4>
                            <p>{this.props.event.price === 0 ? "Free" : `$${this.props.event.price}`}</p>
                        </figcaption>
                    </figure>
                </div>
                :
                !this.state.added?
                    <div className={this.props.myTeam !== undefined && this.props.myTeam !== null ? "irregular_event_card" : "regular_card"}>
                        <div className="group_logo_div">
                            <img className="group_logo" src={this.props.event.pic_path} alt="event_logo" />
                            <p className="group_location" style={{fontSize: "40px"}}>{this.props.event.price === 0 ? "Free" : `$${this.props.event.price}`}</p>
                            <p className="event_address" style={{fontSize: "20px"}}>{this.props.event.address}</p>
                            <div className="location-qr">
                                <QRCode onClick={this.handleClick} value={`https://maps.google.com/?q=${this.props.event.address}`} size={this.state.clicked? 242: 32}/>
                            </div>
                            <p className="event_location">Players per team: {this.props.event.players_per_team}</p>
                            <p className="event_location">Number of teams: {this.props.event.max_number_of_teams}</p>
                            <p className="team_locatevent_locationion" style={{borderBottom: "3px dotted white"}}>{this.props.event.pretty_time}</p>
                            {this.state.going.length !== 0 ?
                                <Fragment>
                                <p>Going</p>
                                {this.state.going.length > 5 ?
                                    <div className="avatars">
                                        {this.state.going.sort(() => 0.5 - Math.random()).slice(0, 4).map(user => <span className="avatar"><img  src={user.profile_pic_path} /></span>)}
                                        <span className="avatar" style={{backgroundColor: "#E8474C"}} title="More users"><h1>+{this.state.going.length - 4}</h1></span>
                                    </div>
                                    :
                                    <div className="avatars">
                                        {this.state.going.sort(() => 0.5 - Math.random()).map(user => <span className="avatar"><Link to={`/profile/@${user.username}`}><img  src={user.profile_pic_path} title={user.username} /></Link></span>)}
                                    </div>
                                }
                                </Fragment>
                                :
                                null
                            }
                            {this.state.maybe.length !== 0 ?
                                <Fragment>
                                <p>Maybe</p>
                                {this.state.maybe.length > 5 ?
                                    <div className="avatars">
                                        {this.state.maybe.sort(() => 0.5 - Math.random()).slice(0, 4).map(user => <span className="avatar" ><img  src={user.profile_pic_path} /></span>)}
                                        <span className="avatar" style={{backgroundColor: "#E8474C"}} title="More users"><h1>+{this.state.maybe.length - 4}</h1></span>
                                    </div>
                                    :
                                    <div className="avatars">
                                        {this.state.maybe.sort(() => 0.5 - Math.random()).map(user => <span className="avatar"><Link to={`/profile/@${user.username}`}><img  src={user.profile_pic_path} title={user.username} /></Link></span>)}
                                    </div>
                                }
                                </Fragment>
                                :
                                null
                            }
                            {this.state.nope.length !== 0 ?
                                <Fragment>
                                <p>Not going</p>
                                {this.state.nope.length > 5 ?
                                    <div className="avatars">
                                        {this.state.nope.sort(() => 0.5 - Math.random()).slice(0, 4).map(user => <span className="avatar"><img  src={user.profile_pic_path} /></span>)}
                                        <span className="avatar" style={{backgroundColor: "#E8474C"}} title="More users"><h1>+{this.state.nope.length - 4}</h1></span>
                                    </div>
                                    :
                                    <div className="avatars">
                                        {this.state.nope.sort(() => 0.5 - Math.random()).map(user => <span className="avatar"><Link to={`/profile/@${user.username}`}><img  src={user.profile_pic_path} title={user.username} /></Link></span>)}
                                    </div>
                                }
                                </Fragment>
                                :
                                null
                            }
                        </div>
                        <div className="group_info_div">
                            <h1 className="group_name">{this.props.event.name}</h1>
                            <h2 className="group_desc">{this.props.event.description}</h2>
                            {this.props.myTeam !== undefined && this.props.myTeam !== null?
                                this.props.myTeam.attributes.events === undefined || this.props.myTeam.attributes.events.find(event => event.id === this.props.event.id) === undefined?
                                    <button onClick={this.handleParticipateInEvent} style={{marginTop: "30px", marginBottom: "10px"}} className='dash_button'>Count my team in!</button>
                                    :
                                    <Fragment>
                                        <Fragment>
                                        {
                                            this.state.going.length < this.props.event.players_per_team || this.state.going.find(user => user.id === this.props.currentUser.user.data.attributes.id) ?
                                                <div onChange={this.setAttendance} name="radio" className="radio-group" style={{marginBottom: "10px"}}>
                                                    <input type="radio" id={`${this.props.event.id}-one`} value="Going" name={`selector${this.props.event.id}`}/>
                                                    <label htmlFor={`${this.props.event.id}-one`}>I'm Going!</label>
                                                    <input type="radio" id={`${this.props.event.id}-two`} value="Maybe" name={`selector${this.props.event.id}`}/>
                                                    <label htmlFor={`${this.props.event.id}-two`}>Maybe</label>
                                                    <input type="radio" id={`${this.props.event.id}-three`} value="Nope" name={`selector${this.props.event.id}`}/>
                                                    <label htmlFor={`${this.props.event.id}-three`}>Nope</label>
                                                </div>
                                                :
                                                <h1 style={{color: "white"}}>Waitlist is available!</h1>
                                                
                                        }
                                        </Fragment>
                                        <Fragment>
                                        {
                                            this.props.myTeam.attributes.admin.id === this.props.currentUser.user.data.attributes.id?
                                            <button onClick={this.handleUnparticipateInEvent} style={{marginTop: "20px", marginBottom: "10px"}} className='dash_button'>Sorry, my team can't make it</button>
                                            :
                                            null
                                        }
                                        </Fragment>
                                    </Fragment>
                                :
                                null

                            }
                        </div>
                    </div>
                    :
                    null
            }
        </Fragment>
        );
    }
}

function msp(state){
    return {
        currentUser: state.userReducer.currentUser,
        myTeam: state.teamReducer.currentTeam,
        myGroup: state.teamReducer.currentGroup,
        myEvents: state.userReducer.myEvents,
        // sportId: state.teamReducer.currentSportId
    }
}

export default connect(msp, { addEvent, addAvailableEvent, setTeam })(EventCard)