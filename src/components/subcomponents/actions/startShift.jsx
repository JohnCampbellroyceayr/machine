import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';

class StartShift extends Component {
    state = {
        menus: [
            {id: 0, text: null, class: 'default', hidden: true, ref: React.createRef()},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Start Shift"},
        ],
    }
    componentDidMount() {
        this.updateTextMenus();
    }
    updateTextMenus = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].text = this.renderStartShiftMenu(0);
            return { menus: menus };
        });
    }
    renderStartShiftMenu = (index) => {
        const text = (<h2>Please enter Machine:</h2>);
        const input = (<input type='text' placeholder='machine' onKeyDown={(e) => this.startShiftKeyPress(e)} ref={this.state.menus[index].ref}></input>);
        return (
            <div>
                {text}
                {input}
            </div>
        );
    }
    startShiftKeyPress(e) {
        if (e.keyCode === 13) {
            if(this.props.startShift(e.target.value)) {
                this.setState(prevState => {
                    const menus = [...prevState.menus];
                    menus[0].hidden = true;
                    return { menus: menus };
                });
            }
            e.target.value = "";
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
 
export default StartShift;