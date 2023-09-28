import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';

class Setup extends Component {
    state = {
        menus: [
            {id: 0, text: null, class: 'default', hidden: true, ref: React.createRef()},
            {id: 1, text: null, class: 'default', hidden: true, ref: React.createRef(), ref2: React.createRef()},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Setup"},
            {id: 1, class: 'none', text: "Yes"},
        ],
        setupMenus: [
        ],
        setupButtons: [
        ],
        oneOrder: null,
        jobs: [],
        seq: [],
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
            menus[0].text = this.renderChooseNumberOfJobsMenu(0);
            menus[1].text = this.renderOrderMenu(1);
            const buttons = [...prevState.buttons];
            buttons[0].disabled = (this.props.status == "Idle" || this.props.status == "Working") ? false : true;
            return { menus: menus, buttons: buttons};
        });
    }
    renderChooseNumberOfJobsMenu = (index) => {
        const text = (<h2>Do you want to setup more than 1 job? Enter = No </h2>);
        const buttons = (
            <>
                <button className='pick-menu' onClick={() => this.showrenderOrderMenu(false, 1)}>Yes</button>
                <button className='pick-menu' ref={this.state.menus[index].ref} onClick={() => this.showrenderOrderMenu(true, 1)}>No</button>
            </>
        );
        return (
            <div>
                {text}
                {buttons}
            </div>
        ); 
    }
    showrenderOrderMenu = (bool, index) => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[index].hidden = false;
            return { menus: menus, oneOrder: bool, jobs: [], seq: [],};
        }, () => {
            this.state.menus[index].ref.current.focus();
        });
    }
    renderOrderMenu(index) {
        const inputOrder = (<input type='text' placeholder='order' onKeyDown={(e) => this.setupKeyPress(e, "order")} ref={this.state.menus[index].ref}></input>);
        const inputSeq = (<input type='text' placeholder='seq' onKeyDown={(e) => this.setupKeyPress(e, "seq")} ref={this.state.menus[index].ref2}></input>);
        const html = (
            <div>
                Enter work order number:<br></br>
                {inputOrder}<br></br>
                Enter work order sequence:<br></br>
                {inputSeq}
            </div>
        )
        return html;
    }

    setupKeyPress = (e, type) => {
        if (e.keyCode === 13) {
            if (e.target.value.trim()) {
                this.enterJob(e.target.value, type);
            }
            else if(this.state.jobs.length > 0 && this.state.oneOrder != true && type == "order") {
                this.enterJob(e.target.value, type);
            }
            else {
                alert("Please fill out both the seq and the order")
            }
        }
    }
    enterJob = (value, type) => {
        if (type == "order") {
            if(value != "") {
                this.state.menus[1].ref2.current.focus();
            }
            else {
                this.setup();
            }
        }
        else {
            this.setState(prevState => {
                const jobs = [...prevState.jobs];
                const seq = [...prevState.seq];
                jobs.push(this.state.menus[1].ref.current.value);
                seq.push(this.state.menus[1].ref2.current.value);
                return { jobs: jobs, seq: seq };
            }, () => {
                this.state.menus[1].ref.current.value = "";
                this.state.menus[1].ref2.current.value = "";
                this.state.menus[1].ref.current.focus();
                if (this.state.oneOrder) {
                    this.setup();
                }
            });
        }
    }
    setup = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].hidden = true;
            menus[1].hidden = true;
            return { menus: menus };
        });
        this.props.setup(this.state.jobs, this.state.seq);
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
 
export default Setup;