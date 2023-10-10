import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';

class Play extends Component {
    play = () => {
        this.props.play();
    }
    render() {
        let status = '';
        try {
            status = this.props.status.includes("Paused");
        }
        catch {
            
        }
        const disabled = (status) ? false : true;
        return (
            <button className='action' onClick={this.play} disabled={disabled}>Resume</button>
        );
    }
}
 
export default Play;