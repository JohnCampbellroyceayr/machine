import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';

class Play extends Component {
    play = () => {
        this.props.play();
    }
    render() { 
        return (
            <button className='action' onClick={this.play}>Resume</button>
        );
    }
}
 
export default Play;