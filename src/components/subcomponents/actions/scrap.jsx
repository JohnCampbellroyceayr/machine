import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';

class Scrap extends Component {
    state = {
        menus: [
            {id: 0, text: null, class: 'default', hidden: true},
            {id: 1, text: null, class: 'default', hidden: true, ref: React.createRef()},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Scrap"},
            {id: 1, class: 'none', text: "Yes"},
        ],
        setupMenus: [
        ],
        setupButtons: [
        ],
        jobIndex: [],
        numPieces: 0,
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.updateMenus();
        }
    }
    componentDidMount() {
        this.updateMenus();
    }
    updateMenus = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].text = this.renderOrderMenu(0);
            return { menus: menus };
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
    enterToRun = (value, index) => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].hidden = true;
            menus[1].hidden = true;
            return { menus: menus };
        });
        this.props.scanScrap(index, value);
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