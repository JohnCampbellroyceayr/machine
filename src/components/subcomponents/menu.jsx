import React, { Component } from 'react';
import Button from './button';
import './styling/menu.css'

class menu extends Component {
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
            {id: 0, text: "Start Shift", onclick: () => {this.openMenu(0)}},
            {id: 1, text: "Setup Jobs(s)", onclick: () => {this.openMenu(1)}},
            {id: 2, text: "Run Jobs(s)", onclick: () => {this.openMenu(2)}},
            {id: 3, text: "Pause Machine", onclick: () => {this.openMenu(3)}},
            {id: 4, text: "Resume", onclick: () => {this.openMenu(4)}},
            {id: 5, text: "Report Good Pcs", onclick: () => {this.openMenu(5)}},
            {id: 6, text: "Report scrap", onclick: () => {this.openMenu(6)}},
        ]
    }
    openMenu = (id) => {
        const newDisplay = (this.state.menus[id].hidden) ? false : true;
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[id].hidden = newDisplay;
            return { menus: menus };
        });
    }
    renderMenu = () => {
        return this.state.menus.map(menu => 
           <React.Fragment>
                <div className={menu.class} style={{display: (menu.hidden) ? "none" : "block"}}>
                    {menu.text}
                </div>
                <Button
                    menu={this.menu}
                    button={this.state.buttons[menu.id]}
                />
           </React.Fragment>
        );
    }
    renderBackScreen = () => {
        if (this.menuIsOpen()) {
            return (
                <div className='backScreen' onClick={this.closeMenu}></div>

            ); 
        }       
    }
    menuIsOpen = () => {
        const menus = this.state.menus;
        for (let i = 0; i < menus.length; i++) {
            if(menus[i].hidden === false) {
                return true;
            }            
        }
    }
    closeMenu = () => {
        const menus = this.state.menus;
        for (let i = 0; i < menus.length; i++) {
            if(menus[i].hidden === false) {
                this.setState(prevState => {
                    const menus = prevState.menus;
                    menus[i].hidden = true;
                    return { menus: menus };
                });
            }            
        }
    }
    render() {
        return (
            <React.Fragment>
                {this.renderBackScreen()}
                {this.renderMenu()}
            </React.Fragment>
        );
    }
}
 
export default menu;