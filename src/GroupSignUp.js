import React from "react";
import { Redirect, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { setUser } from './redux/actions/user_actions'
import ImageUploader from 'react-images-upload';

class TeamSignUp extends React.Component{
    state = {
        name: "",
        g_logo: null,
        location: "",
        description: "",
        sport: "",
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
            g_logo: e.target.files[0],
        });
    }

    handleSubmit = (e) => {
        e.preventDefault()
        debugger
        const fD = new FormData()
        fD.append("name", this.state.name)
        fD.append("location", this.state.location)
        fD.append("g_logo", this.state.g_logo)
        fD.append("description", this.state.description)
        fD.append("activity_id", this.state.sport)
        fD.append("admin_id", this.props.currentUser.user.data.attributes.id)
            fetch("http://localhost:3000/api/v1/groups", {
                method: "POST",
                body: fD
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
    }

    // componentDidMount(){
    // }
      
    

    render(){
        if(this.state.created) return <Redirect to="/dashboard" />
        return (
        <div className="dash_main" style={{marginTop: "100px"}}>
            <form onSubmit={this.handleSubmit} className='form'>
            <p className='field required' style={{marginTop: "130px"}}>
                <label className='label required' htmlFor='name'>Name</label>
                <input className='text-input' id='name' name='name' value={this.state.name} onChange={this.handleChange} required type='text'/>
            </p>
            {/* <ImageUploader
                withIcon={true}
                buttonText='Choose images'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            /> */}
            <p className='field half'>
                <label className='label' htmlFor='select'>Location</label>
                <select className='select' value={this.state.location} onChange={this.handleChange} name="location" id='select'>
                <option value=''></option>
                <option value='New York, NY'>New York, NY</option>
                <option value='Los Angeles, CA'>Los Angeles, CA</option>
                <option value='Miami, FL'>Miami, FL</option>
                </select>
            </p>
            <p className='field half'>
            <label className='label' htmlFor='select'>Sport</label>
                <select className='select' style={{textAlignLast: "center"}} value={this.state.sport} onChange={this.handleChange} name="sport" id='select_sport'>
                <option value='' disabled></option>
                {this.props.currentUser.user.data.attributes.activities.map(sport => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                </select>
            </p> 
            <p className='field required'>
                <label className='label' htmlFor='logo_path'>Logo</label>
                <input className='text-input' id='logo_path' name='logo_path' onChange={this.addPic} accept="image/*" required type='file' />
            </p>
            <p className='field'>
                <label className='label' htmlFor='description'>Description</label>
                <textarea className='textarea' cols='50' id='description' name='description' value={this.state.description} onChange={this.handleChange} rows='4'></textarea>
            </p>
            <p className='field'>
                <input className='button' type='submit' value='Create a group' />
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