import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';
import serverFiles from '../serverMachine.js';

class EndShift extends Component {
    state = {
        menus: [
            {id: 0, text: null, class: 'default', hidden: true, ref: React.createRef()},
        ],
        buttons: [
            {id: 0, class: 'action', text: "End Shift"},
        ],
    }
    componentDidMount() {
        this.updateTextMenus();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.status != this.props.status) {
            this.updateTextMenus();
        }
    }
    updateTextMenus = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].text = this.renderEndShiftMenu(0);
            const buttons = [...prevState.buttons];
            buttons[0].disabled = (this.props.status != undefined) ? false : true;
            return { menus: menus, buttons: buttons};
        });
    }

    renderEndShiftMenu = (index) => {
        let machineName = '';
        try {
            machineName = this.props.machine.replace("-", " ");
        } catch (error) {
            console.log(error);
            machineName = '';
        }
        const text = (<h2>Do you want to end the shift of {machineName}</h2>);
        const button = (<button onClick={this.endShift} className='pick-menu' ref={this.state.menus[index].ref}>End shift</button>)
        return (
            <div>
                {text}
                {button}
            </div>
        );
    }
    endShift = () => {
        if(this.props.endShift()) {
            this.setState(prevState => {
                const menus = [...prevState.menus];
                menus[0].hidden = true;
                return { menus: menus };
            });
        }
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
 
export default EndShift;