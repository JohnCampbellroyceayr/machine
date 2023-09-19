import React, { Component } from 'react';
import './styling/button.css'

class Button extends Component {
    render() { 
        const btn = this.props.button;
        return (
            <button onClick={btn.onclick} className={btn.class}>{btn.text}</button>
        );
    }
}
 
export default Button;