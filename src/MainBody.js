import React from 'react';

class MainBody extends React.Component {
    state = {
        showArea: "",
        showLat: 0,
        showLong: 0,
        mapClicked: false,
        randArea: {},
        loaded: false,
        clicked: false,
        chosenEvent: {}
    }


    render(){
        return (
            <div>   
                <h1>Hi bitch!</h1>
            </div>
        );
    }
}

export default MainBody;