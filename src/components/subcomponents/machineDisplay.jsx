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
                <div className='cell'>Job</div>
                <div className='cell'>Sequence</div>
                <div className='cell'>Part Number</div>
                {/* <div className='cell'>Job Status</div> */}
                <div className='cell'>Good Pieces</div>
                <div className='cell'>Pieces Needed</div>
            </React.Fragment>
        )
        if (this.machineHasMoreThanOneJob()) {
            var text = header;
            for (let i = 0; i < machine["Jobs"].length; i++) {
                text = (
                    <>
                        {text}
                        <br></br>
                        <div className='cell'>{machine["Jobs"][i]}</div>
                        <div className='cell'>{machine["Sequences"][i]}</div>
                        <div className='cell'>{machine["PartNumbers"][i]}</div>
                        {/* <div className='cell'>{machine["JobStatus"][i]}</div> */}
                        <div className='cell'>{machine["GoodPieces"][i]}</div>
                        <div className='cell'>{machine["PiecesNeeded"][i]}</div>
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
                    <div className='cell'>{machine["Jobs"]}</div>
                    <div className='cell'>{machine["Sequences"]}</div>
                    <div className='cell'>{machine["PartNumbers"]}</div>
                    {/* <div className='cell'>{machine["JobStatus"]}</div> */}
                    <div className='cell'>{machine["GoodPieces"]}</div>
                    <div className='cell'>{machine["PiecesNeeded"]}</div>
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
    renderTableOneJob = () => {
        const machine = this.props.Machine;
        return (
            <>
                <div className='titleValue'>Current Job:</div>
                <div className='mini-cellTable'>
                    <div className='mini-cell'>Job</div>
                    <div className='mini-cell'>Sequence</div>
                    <div className='mini-cell'>Part Number</div>
                    <div className='mini-cell'>Good Pieces</div>
                    <div className='mini-cell'>Pieces Needed</div>
                    <br></br>
                    <div className='mini-cell'>{machine["Jobs"]}</div>
                    <div className='mini-cell'>{machine["Sequences"]}</div>
                    <div className='mini-cell'>{machine["PartNumbers"]}</div>
                    <div className='mini-cell'>{machine["GoodPieces"]}</div>
                    <div className='mini-cell'>{machine["PiecesNeeded"]}</div>
                </div>
            </>
        );
    }
    renderOverOneJob = () => {
        return (
            <>
                Job: {this.state.jobText} <Menu menus={this.state.menu} buttons={this.state.button} /><br></br>
                Part Number: {this.state.partNumberText} <br></br>
            </>
        )
    }
    render() {
        var text;
        if (this.state.jobText != "[Group]") {
            text = this.renderTableOneJob();
        }
        else {
            text = this.renderOverOneJob();
        }
        return (
        <div>
            {/* Job: {this.state.jobText} <Menu menus={this.state.menu} buttons={this.state.button} /><br></br>
            Part Number: {this.state.partNumberText} <Menu menus={this.state.menu} buttons={this.state.button} /><br></br> */}
            {text}
        </div>
        );
    }
}
 
export default display;