import React, { Component } from 'react';
import './styling/menu.css'

class menu extends Component {
    state = {
        hidden: this.props.menu.hidden
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ hidden: this.props.menu.hidden });
        }
    }
    renderBackScreen = () => {
        if (this.menuIsOpen()) {
            return (
                <div className='backScreen'></div>
            ); 
        }       
    }
    menuIsOpen = () => {
        if (this.props.menu.hidden) {
            return false;
        }
        return true;
    }
    render() {
        const menu = this.props.menu;
        return (
            <>
                {this.renderBackScreen()}
                <div className={menu.class} style={{display: (this.state.hidden) ? "none" : "block"}}>
                    {menu.text}
                </div>
            </>
        );
    }
}
 
export default menu;