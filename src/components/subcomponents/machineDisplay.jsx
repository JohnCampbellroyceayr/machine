import React, { Component } from 'react';
import Menu from './valuesMenu.jsx';

class display extends Component {
    state = {
        jobText: null,
        partNumberText: null,
        menu: [
            {id: 0, text: "Hello", class: 'big', hidden: true},
        ],
        button: [
            {id: 0, class: 'small', text: "View"},
        ],
    }
    componentDidMount() {
        this.updateView();
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.updateView();
        }
    }
    updateView() {
        const machine = this.props.Machine;
        if (this.machineHasMoreThanOneJob()) {
            this.setState({ jobText: "[Group]", partNumberText: "[Group]" });
        }
        else {
            this.setState({ jobText: machine["Jobs"], partNumberText: machine["PartNumbers"] });
        }
        this.updateMenu();
    }
    updateMenu = () => {
        const machine = this.props.Machine;
        const header = (
            <React.Fragment>
                <button className='cell'>Job</button>
                <button className='cell'>Sequence</button>
                <button className='cell'>Part Number</button>
                <button className='cell'>Job Status</button>
                <button className='cell'>Good Pieces</button>
                <button className='cell'>Pieces Needed</button>
            </React.Fragment>
        )
        if (this.machineHasMoreThanOneJob()) {
            var text = header;
            for (let i = 0; i < machine["Jobs"].length; i++) {
                text = (
                    <>
                        {text}
                        <br></br>
                        <button className='cell'>{machine["Jobs"][i]}</button>
                        <button className='cell'>{machine["Sequences"][i]}</button>
                        <button className='cell'>{machine["PartNumbers"][i]}</button>
                        <button className='cell'>{machine["JobStatus"][i]}</button>
                        <button className='cell'>{machine["GoodPieces"][i]}</button>
                        <button className='cell'>{machine["PiecesNeeded"][i]}</button>
                    </>
                ) 
            }
            this.setState(prevState => {
                const menu = [...prevState.menu];
                menu[0].text = text;
                return { menu: menu };
            });
        }
        else {
            const text = (
                <div>
                    {header}
                    <br></br>
                    <button className='cell'>{machine["Jobs"]}</button>
                    <button className='cell'>{machine["Sequences"]}</button>
                    <button className='cell'>{machine["PartNumbers"]}</button>
                    <button className='cell'>{machine["JobStatus"]}</button>
                    <button className='cell'>{machine["GoodPieces"]}</button>
                    <button className='cell'>{machine["PiecesNeeded"]}</button>
                </div>
            );
            this.setState(prevState => {
                const menu = [...prevState.menu];
                menu[0].text = text;
                return { menu: menu };
            });
        }
    }
    machineHasMoreThanOneJob() {
        const machine = this.props.Machine;
        if (Array.isArray(machine["Jobs"])) {
            return true;
        }
        return false;
    }
    render() { 
        return (
        <div>
            Job: {this.state.jobText} <Menu menus={this.state.menu} buttons={this.state.button} /><br></br>
            Part Number: {this.state.partNumberText} <Menu menus={this.state.menu} buttons={this.state.button} /><br></br>
        </div>
        );
    }
}
 
export default display;