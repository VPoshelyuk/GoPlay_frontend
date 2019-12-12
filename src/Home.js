import React from 'react';
import MainBody from './MainBody'

export default class Home extends React.Component{
  render(){
    return (
      <div className="App">
        <MainBody 
          events={this.props.events} 
          chooseEvent={this.props.chooseEvent}
          setAllNearesEvents={this.props.setAllNearesEvents}
          setAllChoosenEvents={this.props.setAllChoosenEvents}
          setAllFreeEvents={this.props.setAllFreeEvents}
          setAllRandEvents={this.props.setAllRandEvents}
          setContainerId={this.props.setContainerId}
          setMyCoords={this.props.setMyCoords}
        />
      </div>
    )
  }
}