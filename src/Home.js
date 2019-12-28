import React from 'react';
import InfoContainer from './InfoContainer'
import { connect } from 'react-redux'

class Home extends React.Component{
  render(){
    return (
      <div className="App">
        <InfoContainer />
      </div>
    )
  }
}

function msp(state){
  return {
    currentUser: state.userReducer.currentUser
  }
}

export default connect(msp)(Home)
