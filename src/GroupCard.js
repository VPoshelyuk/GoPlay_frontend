import React, {Fragment} from "react";
import { Redirect, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { setGroup } from './redux/actions/team_actions'

class GroupCard extends React.Component{

    state= {
        added: false,
        viewed: false
    }

    handleAddGroup = () => {
        fetch("http://localhost:3000/api/v1/team_groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                group_id: this.props.group.id,
                team_id: this.props.myTeam.id
            })
            })
        .then(res => res.json())
        .then(
            this.setState({
                added: true
            })
        )
    }

    handleViewGroup = () => {
        // this.props.setGroup(this.props.group)
        this.setState({
            viewed: true
        })
    }

    render(){
        console.log(this.props.group)
        if(this.state.added){
            this.setState({
                added: false
            })
            return <Redirect to="/dashboard" />
        }
        if(this.state.viewed){
            this.setState({
                viewed: false
            })
            return <Redirect to={`/group/${this.props.group.id}`} />
        }
        return (
            <Fragment>
                {
                    this.props.dash_style?
                    <NavLink to={`/group/${this.props.group.id}`}>
                        <figure style={{backgroundImage: `url(${this.props.group.logo_path})`}}>
                            <figcaption>
                                <h4> <span>{this.props.group.name}</span></h4>
                                {/* <h4> <span>{this.props.group.location}</span></h4> */}
                                <p>{this.props.group.location}</p>
                            </figcaption>
                        </figure>
                    </NavLink>
                    :
                    <div onClick={this.props.add === 0 ? this.handleViewGroup : null} className="regular_card">
                        <div className="group_logo_div">
                            <img className="group_logo" src={this.props.group.logo_path} alt="group_logo" />
                            <p className="group_location">{this.props.group.location}</p>
                        </div>
                        <div className="group_info_div">
                            <h1 className="group_name">{this.props.group.name}</h1>
                            <h2 className="group_desc">{this.props.group.description}</h2>
                        </div>
                        {this.props.add === 1 ?
                        <Fragment>
                            <button onClick={this.handleViewGroup} style={{marginTop: "20px", width: "70%", marginRight: "2.5%"}} className='dash_button'>View Group</button>
                            <button onClick={this.handleAddGroup} style={{marginTop: "20px", width: "70%", marginRight: "2.5%"}} className='dash_button'>Join Group</button>
                        </Fragment>
                        :
                        null
                        }
                    </div>
                }
            </Fragment>
        );
    }
}

function msp(state){
    return {
        currentUser: state.userReducer.currentUser,
        myTeam: state.teamReducer.currentTeam,
        sportId: state.teamReducer.currentSportId
    }
}

export default connect(msp, { setGroup })(GroupCard)
// changeViewStatus on all button presses