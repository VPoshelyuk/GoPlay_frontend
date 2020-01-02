import React, {Fragment} from "react";
import { Redirect, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import GroupCard from './GroupCard';

class GroupsContainer extends React.Component{
    state= {
        groupsAvailable: [],
        unfilteredAvailable: [],
        created: false
    }

    componentDidMount(){
        fetch("http://localhost:3000/api/v1/groups")
        .then(res => res.json())
        .then(groups => {

            if(this.props.add === 0){
                this.setState({
                    groupsAvailable: groups.groups.data,
                    unfilteredAvailable: groups.groups.data
                })
            }else{
                console.log(this.props, groups.groups.data)
                let filteredGroup = groups.groups.data.filter(group => group.attributes.activity.id === this.props.myTeam.attributes.activity_id && !this.props.myTeam.attributes.groups.find(currGroup => currGroup.id === group.attributes.id))
                this.setState({
                    groupsAvailable: filteredGroup
                })
            }
        })
    }

    handleChange = (event) => {
        switch (event.target.value) {
            case 'New York, NY':
            case 'Los Angeles, CA':
            case 'Miami, FL':
                this.setState({
                    groupsAvailable: this.state.unfilteredAvailable.filter(group => group.attributes.location === event.target.value)
                })
                break;
            case 'Soccer':
            case 'Volleyball':
            case 'Basketball':
            case 'Football':
            case 'Baseball':
            case 'Ice Hockey':
                this.setState({
                    groupsAvailable: this.state.unfilteredAvailable.filter(group => group.attributes.activity.name === event.target.value)
                })
                break;
            case 'event_number':
                this.setState({
                    groupsAvailable: this.state.unfilteredAvailable.sort((a, b) => b.attributes.events.length - a.attributes.events.length )
                })
                break;
            case 'team_number':
                this.setState({
                    groupsAvailable: this.state.unfilteredAvailable.sort((a, b) => b.attributes.teams.length - a.attributes.teams.length )
                })
                break;
            default:
                this.setState({
                    groupsAvailable: this.state.unfilteredAvailable
                })
                break;
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.myTeam !== this.props.myTeam){
            fetch("http://localhost:3000/api/v1/groups")
            .then(res => res.json())
            .then(groups => {

                if(this.props.add === 0){
                    this.setState({
                        groupsAvailable: groups.groups.data,
                        unfilteredAvailable: groups.groups.data
                    })
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
            {
            this.props.add === 0 ?
            <form onChange={this.handleChange} className='form'>
                <p className='field' style={{right: "0" ,marginTop: "-20px", marginBottom: "0px", width: "100%"}}>
                    <select className='select' style={{textAlignLast: "center"}} defaultValue='' name="location" id='select'>
                    <option value=''>Sort or filter by:</option>
                    <option value='location' disabled>Filter by location:</option>
                    <option value='New York, NY'>New York, NY</option>
                    <option value='Los Angeles, CA'>Los Angeles, CA</option>
                    <option value='Miami, FL'>Miami, FL</option>
                    <option value='sport' disabled>Filter by sport:</option>
                    <option value='Soccer'>Soccer</option>
                    <option value='Football'>Football</option>
                    <option value='Basketball'>Basketball</option>
                    <option value='Volleyball'>Volleyball</option>
                    <option value='Baseball'>Baseball</option>
                    <option value='Ice Hockey'>Ice Hockey</option>
                    <option value='e_num' disabled>Sort by:</option>
                    <option value='event_number' >Events number</option>
                    <option value='team_number' >Teams number</option>
                    {/* {this.props.currentUser.user.data.attributes.activities.sort((a, b) => a.id - b.id).map(sport => <option key={sport.id} value={sport.id}>{sport.name}</option>)} */}
                    </select>
                </p> 
            </form>
            :
            null
            }
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