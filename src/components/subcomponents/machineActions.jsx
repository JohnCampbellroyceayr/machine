import React, { Component } from 'react';
import Menu from './valuesMenu.jsx';

class Actions extends Component {
    state = {
        menus: [
            {id: 0, text: "Hello", class: 'default', hidden: true},
            {id: 1, text: "Bro Hello", class: 'default', hidden: true},
            {id: 2, text: "Bro Hello", class: 'default', hidden: true},
            {id: 3, text: "Bro Hello", class: 'default', hidden: true},
            {id: 4, text: "Bro Hello", class: 'default', hidden: true},
            {id: 5, text: "Bro Hello", class: 'default', hidden: true},
            {id: 6, text: "Bro Hello", class: 'default', hidden: true},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Start Shift"},
            {id: 1, class: 'action', text: "Setup Jobs(s)"},
            {id: 2, class: 'action', text: "Run Jobs(s)"},
            {id: 3, class: 'action', text: "Pause Machine"},
            {id: 4, class: 'action', text: "Resume"},
            {id: 5, class: 'action', text: "Report Good Pcs"},
            {id: 6, class: 'action', text: "Report scrap"},
        ]
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
 
export default Actions;