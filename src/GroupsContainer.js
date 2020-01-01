import React, {Fragment} from "react";
import { Redirect, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import GroupCard from './GroupCard';

class GroupsContainer extends React.Component{
    state= {
        groupsAvailable: [],
        created: false
    }

    componentDidMount(){
        fetch("http://localhost:3000/api/v1/groups")
        .then(res => res.json())
        .then(groups => {

            if(this.props.add === 0){
                this.setState({groupsAvailable: groups.groups.data})
            }else{
                console.log(this.props, groups.groups.data)
                let filteredGroup = groups.groups.data.filter(group => group.attributes.activity.id === this.props.myTeam.attributes.activity_id && !this.props.myTeam.attributes.groups.find(currGroup => currGroup.id === group.attributes.id))
                this.setState({groupsAvailable: filteredGroup})
            }
        })
    }

    componentDidUpdate(prevProps){
        if(prevProps.myTeam !== this.props.myTeam){
            fetch("http://localhost:3000/api/v1/groups")
            .then(res => res.json())
            .then(groups => {

                if(this.props.add === 0){
                    this.setState({groupsAvailable: groups.groups.data})
                }else{
                    console.log(groups.groups.data)
                    let filteredGroup = groups.groups.data.filter(group => group.attributes.activity.id === this.props.myTeam.attributes.activity_id)
                    this.setState({groupsAvailable: filteredGroup})
                }
            })
        }
    }

    createGroup = () => {
        this.setState({
            created: true
        })
    }

    render(){
        if(this.state.created){
            this.setState({
                created: false
            })
            return <Redirect to="/create_group" />
        }
        return (
        <div className="search-main">
            {this.state.groupsAvailable.length !== 0 ?
            <Fragment>
                {this.props.add === 0 && this.props.currentUser !== null ?
                    <button style={{marginTop: "50px", marginBottom: "50px"}} onClick={this.createGroup} className='dash_button'>Create new Group</button>
                    :
                    null
                }
                {this.state.groupsAvailable.map(group => <GroupCard key={group.id} group={group.attributes} add={this.props.add} />)}
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
        myTeam: state.teamReducer.currentTeam,
        sportId: state.teamReducer.currentSportId
    }
}

export default connect(msp)(GroupsContainer)