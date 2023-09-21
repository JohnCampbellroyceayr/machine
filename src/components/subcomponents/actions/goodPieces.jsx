import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';
class GoodPieces extends Component {
    state = {
        menus: [
            {id: 0, text: null, class: 'default', hidden: true, ref: React.createRef()},
            {id: 1, text: null, class: 'default', hidden: true},
            {id: 2, text: null, class: 'default', hidden: true, ref: React.createRef()},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Good Pieces"},
            {id: 1, class: 'none', text: "Yes"},
            {id: 2, class: 'none', text: "Yes"},
        ],
        setupMenus: [
        ],
        setupButtons: [
        ],
        oneOrder: null,
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
            menus[0].text = this.renderChooseNumberOfJobsMenu(0);
            menus[1].text = this.renderOrderMenu(1);
            return { menus: menus };
        });
    }
    renderChooseNumberOfJobsMenu = (index) => {
        const text = (<h2>Do you want to scan good pieces of more than 1 job? Enter = No </h2>);
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
        const enterBtn = (<button className='pick-menu' onClick={() => this.scanGoodPieces()}>Scan Good Pieces</button>);
        const html = (
            <div>
                Select job:<br></br>
                {jobs}<br></br>
                {enterBtn}
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
    menuToSelectPieces = (orderIndex) => {
        const machineJobs = (Array.isArray(this.props.jobs)) ? this.props.jobs : [this.props.jobs];
        const numPiecesMenuIndex = 2;
        const defaultNumber = this.getDefault(orderIndex);
        this.setState(prevState => {
            const menus = prevState.menus;
            menus[numPiecesMenuIndex].text = [];
            return { menus: menus };
        }, () => {
            const order = machineJobs[orderIndex];
            const inputOrder = (<input type='number' defaultValue={defaultNumber} placeholder='number of pieces' onKeyDown={(e) => this.handleChangePiecesMenu(e, orderIndex)} ref={this.state.menus[numPiecesMenuIndex].ref}></input>);
            const backBtn = (<button className='pick-menu' onClick={() => this.showMenu(1)}>Back</button>);
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
        });
    }
    getDefault = (index) => {
        if (Array.isArray(this.props.jobs)) {
            const needed = this.props.requiredPieces[index];
            const current = this.props.goodPieces[index];
            return needed - current;
        }
        else {
            if (this.props.requiredPieces == "null" || this.props.requiredPieces == undefined) {
                return 0;
            }
            else {
                const needed = this.props.requiredPieces;
                const current = this.props.goodPieces;
                return needed - current;
            }
        }
    }
    enterToRun = (value, index) => {
        const currentValues = this.state.jobIndex;
        for (let i = 0; i < currentValues.length; i++) {
            const indexValue = currentValues[i].index;
            if (index == indexValue) {
                currentValues.splice(i, 1);
                break;
            }
        }
        currentValues.push({index: index, value: value});
        this.setState({ jobIndex: currentValues }, () => {
            if (this.state.oneOrder == true) {
                this.scanGoodPieces();
            }
            else {
                this.updateMenus();
                this.showMenu(1);
            }
        });
    }
    scanGoodPieces = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].hidden = true;
            menus[1].hidden = true;
            menus[2].hidden = true;
            return { menus: menus };
        });

        const jobs = this.state.jobIndex;
        console.log(jobs);
        let jobArray = [];
        let piecesArray = [];
        for (let i = 0; i < jobs.length; i++) {
            jobArray.push(jobs[i].index);
            piecesArray.push(jobs[i].value);
        }
        console.log(jobArray);
        console.log(piecesArray);
        this.props.scanGoodPieces(jobArray, piecesArray);
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
 
export default GoodPieces;