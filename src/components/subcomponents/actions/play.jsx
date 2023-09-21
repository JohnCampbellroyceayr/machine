import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';

class Play extends Component {
    play = () => {
        this.props.play();
    }
    render() {
        const disabled = (this.props.status == "Paused") ? false : true;
        return (
            <button className='action' onClick={this.play} disabled={disabled}>Resume</button>
        );
    }
}
 
export default Play;