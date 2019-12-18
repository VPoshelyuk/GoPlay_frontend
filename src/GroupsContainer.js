import React, {Fragment} from "react";
import { Redirect, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'
import GroupCard from './GroupCard';

class GroupsContainer extends React.Component{
    state= {
        groupsAvailable: []
    }

    componentDidMount(){
        fetch("http://localhost:3000/api/v1/groups")
        .then(res => res.json())
        .then(groups => {
            console.log(groups)
            this.setState({groupsAvailable: groups.groups.data})
        })
    }

    render(){
        return (
        <div className="search-main">
            {this.state.groupsAvailable.length !== 0 ?
            <Fragment>
                {/* <form onChange={this.handleChange} className='form'>
                <p className='field' style={{right: "0" ,marginTop: "-20px", marginBottom: "10px", width: "100%"}}>
                    <select className='select' style={{textAlignLast: "center"}} defaultValue={this.props.currentUser.user.data.attributes.activities[0].id} name="location" id='select'>
                    <option value='' disabled>Choose Sport:</option>
                    {this.props.currentUser.user.data.attributes.activities.map(sport => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                    </select>
                </p> 
                </form> */}
                {this.state.groupsAvailable.map(group => <GroupCard key={group.id} group={group.attributes}/>)}
            </Fragment>
            :
            <div className="dash_main">
                <h1 className="main_text" >Sorry, there are no groups created for this type of sport yet.</h1>
                <h1 className="main_text" >It's a great opportunity to be the first: </h1>
                <NavLink to="/dashboard" className="main_text">Go back to dashboard...</NavLink>
            </div>
            }
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

export default connect(msp, { setUser })(GroupsContainer)