import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';

class Pause extends Component {
    state = {
        menus: [
            {id: 0, text: "Bro Hello", class: 'default', hidden: true, ref: React.createRef()},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Pause Machine"},
        ],
    }
    componentDidMount() {
        this.updateMenus();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.status != this.props.status) {
            this.updateMenus();
        }
    }
    updateMenus = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].text = this.renderMenu(0);
            const buttons = [...prevState.buttons];
            buttons[0].disabled = (this.props.status == "Idle" || this.props.status == "Working") ? false : true;
            return { menus: menus, buttons: buttons};
        });
    }
    renderMenu = () => {
        const buttonYes = (<button className='pick-menu' ref={this.state.menus[0].ref} onClick={() => this.pause()}>Pause</button>)
        const machine = this.props.machine["Machine"];
        return (
            <>
                Do you want to pause machine {machine} (enter for yes)<br></br>
                {buttonYes}
            </>
        );
    }
    pause = () => {
        this.props.pause();
    }
    render() { 
        return (
        <Menu 
            menus={this.state.menus}
            buttons={this.state.buttons}
        />
        );
    }
}
 
export default Pause;