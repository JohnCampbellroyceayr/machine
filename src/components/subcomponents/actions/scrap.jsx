import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';

class Scrap extends Component {
    state = {
        menus: [
            {id: 0, text: null, class: 'default', hidden: true},
            {id: 1, text: null, class: 'default', hidden: true, ref: React.createRef()},
            {id: 2, text: null, class: 'default', hidden: true, ref: React.createRef()},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Scrap"},
            {id: 1, class: 'none', text: "Yes"},
            {id: 2, class: 'none', text: "Yes"},
        ],
        setupMenus: [
        ],
        setupButtons: [
        ],
        jobIndex: [],
        numPieces: 0,
        value: 0,
        index: 0
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.updateMenus();
        }
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
            menus[0].text = this.renderOrderMenu(0);
            menus[2].text = this.renderNoReportReason(2);
            const buttons = [...prevState.buttons];
            buttons[0].disabled = (this.props.status == "Setup" || this.props.status == "Run") ? false : true;
            return { menus: menus, buttons: buttons};
        });
    }
    showrenderOrderMenu = (bool, index) => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[index].hidden = false;
            return { menus: menus, oneOrder: bool, jobIndex: []};
        });
    }
    showMenu = (index) => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus.forEach(menu => {
                menu.hidden = true;
            });
            menus[index].hidden = false;
            return { menus: menus};
        }, () => {
            if (index == 2) {
                this.state.menus[index].ref.current.focus();
            }
        });
    }
    renderOrderMenu(index) {
        const machineJobs = (Array.isArray(this.props.jobs)) ? this.props.jobs : [this.props.jobs];

        const jobs = (machineJobs.length == 0 || machineJobs == "null" || machineJobs == undefined) ? '' : machineJobs.map((job, i) => {
            const ref = React.createRef();
            const numPieces = this.getNumPieces(i);
            const onclick = () => {
                this.menuToSelectPieces(i);
            };
            return <button key={i} className='pick-menu' onClick={onclick} ref={ref}>{job}{" "}{numPieces}</button>
        });
        const html = (
            <div>
                Select job:<br></br>
                {jobs}<br></br>
            </div>
        )
        return html;
    }
    renderNoReportReason(index) {
        return (
            <div>
                Enter Reason for scrap:
                <input type='text' placeholder='Reason for scrap' ref={this.state.menus[index].ref} onKeyDown={(e) => this.handleScrapReason(e)} />
            </div>
        );
    }
    
    getNumPieces = (index) => {
        const jobs = this.state.jobIndex;
        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            if (job.index == index) {
                return "Pieces: " + job.value;
            }
        }
        return '';
    }
    piecesMenuKeyPress = (e) => {
        if (e.keyCode === 13) {
            // this.enterJob(e.target.value, type);
            console.log("object");
        }
    }
    handleChangePiecesMenu = (event, index) => {
        if (event.keyCode === 13) {
           this.enterToRun(event.target.value, index);
        }
    }
    handleScrapReason = (event) => {
        console.log("Asdf");
        if (event.keyCode === 13) {
            this.enterToRunNoReport(event.target.value);
        }
    }
    enterToRun = (value, index) => {
        if(this.props.report[index] == "Y") {
            this.setState(prevState => {
                const menus = [...prevState.menus];
                menus[0].hidden = true;
                menus[1].hidden = true;
                return { menus: menus };
            });
            this.props.scanScrap(index, value);
        }
        else {
            this.setState({ value: value, index: index });
            this.showMenu(2);
        }
    }
    enterToRunNoReport = (reason) => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].hidden = true;
            menus[1].hidden = true;
            menus[2].hidden = true;
            return { menus: menus };
        });
        this.props.scanScrap(this.state.index, this.state.value, reason.replaceAll(" ", "-"));
    }
    menuToSelectPieces = (orderIndex) => {
        const machineJobs = (Array.isArray(this.props.jobs)) ? this.props.jobs : [this.props.jobs];
        const numPiecesMenuIndex = 1;
        const defaultNumber = 0;
        const order = machineJobs[orderIndex];
        const inputOrder = (<input type='number' defaultValue={defaultNumber} placeholder='number of pieces' onKeyDown={(e) => this.handleChangePiecesMenu(e, orderIndex)} ref={this.state.menus[numPiecesMenuIndex].ref}></input>);
        const backBtn = (<button className='pick-menu' onClick={() => this.showMenu(0)}>Back</button>);
        const html = (
            <>
                {order}<br></br>
                {inputOrder}<br></br><br></br>
                {backBtn}<br></br>
            </>
        );
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[numPiecesMenuIndex].text = html;
            menus[numPiecesMenuIndex].hidden = false;
            return { menus: menus };
        }, () => {
            this.state.menus[numPiecesMenuIndex].ref.current.focus();
        });
    }
    render() {
        return (
            <Menu 
                menus={this.state.menus}
                buttons={this.state.buttons}
                numPieces={this.state.numPieces}
            />
        );
    }
}
 
export default Scrap;