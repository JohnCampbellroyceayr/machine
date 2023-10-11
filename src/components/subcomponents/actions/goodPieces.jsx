import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';
class GoodPieces extends Component {
    state = {
        menus: [
            {id: 0, text: null, class: 'default', hidden: true},
            {id: 1, text: null, class: 'default', hidden: true, ref: React.createRef()},
            {id: 2, text: null, class: 'default', hidden: true},
        ],
        buttons: [
            {id: 0, class: 'none', text: "Yes"},
            {id: 1, class: 'none', text: "Yes"},
            {id: 2, class: 'none', text: "Yes"},
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
    componentDidUpdate(prevProps) {
        if (prevProps.status != this.props.status) {
            this.updateMenus();
        }
    }
    updateMenus = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].text = this.renderOrderMenu(0);
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
        });
    }
    updateAndShowRemoveJobMenu = (jobIndex) => {
        console.log("object");
        const job = this.props.jobs[jobIndex];
        const currentGoodPieces = this.props.goodPieces[jobIndex];
        const requiredPieces = this.props.requiredPieces[jobIndex];
        const numPiecesMenuIndex = 1;
        const newGoodPieces = this.state.menus[numPiecesMenuIndex].ref.current.value;
        console.log(newGoodPieces);
        if (parseInt(currentGoodPieces) + parseInt(newGoodPieces) >= requiredPieces) {
            this.showMenu(numPiecesMenuIndex);
        }
        else {
            console.log("job");
            // this.saveAndscanGoodPieces(jobIndex);
        }
        // const yesBtn = (<button onClick={this.removeJob}>Yes</button>)
        // const noBtn = (<button onClick={this.removeJob}>No</button>)
    }
    removeJob = () => {

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
                Select job to scan good pieces on:<br></br><br></br>
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
        //    this.enterToRun(event.target.value, index);
        //    this.scanGoodPieces();
            this.updateAndShowRemoveJobMenu(index);
        }
    }
    menuToSelectPieces = (orderIndex) => {
        const machineJobs = (Array.isArray(this.props.jobs)) ? this.props.jobs : [this.props.jobs];
        const numPiecesMenuIndex = 1;
        const defaultNumber = this.getDefault(orderIndex);
        this.setState(prevState => {
            const menus = prevState.menus;
            menus[numPiecesMenuIndex].text = [];
            return { menus: menus };
        }, () => {
            const order = machineJobs[orderIndex];
            const inputOrder = (<input type='number' defaultValue={defaultNumber} placeholder='number of pieces' onKeyDown={(e) => this.handleChangePiecesMenu(e, orderIndex)} ref={this.state.menus[numPiecesMenuIndex].ref}></input>);
            const backBtn = (<button className='pick-menu' onClick={() => this.showMenu(0)}>Back</button>);
            const enterBtn = (<button className='pick-menu' onClick={() => this.updateAndShowRemoveJobMenu(orderIndex)}>Scan Good Pieces</button>);
            const html = (
                <>
                    {order}<br></br>
                    {inputOrder}<br></br><br></br>
                    {backBtn}<br></br><br></br>
                    {enterBtn}
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
                let difference = needed - current;
                if (difference < 0) {
                    difference = 0;
                }
                return difference;
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
    saveAndscanGoodPieces = (index) => {
        const currentValues = this.state.jobIndex;
        console.log(this.state.menus[1].ref.current.value);
        currentValues.push({index: index, value: this.state.menus[1].ref.current.value});
        this.setState({ jobIndex: currentValues }, () => {
            this.scanGoodPieces();
        });
    }

    scanGoodPieces = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].hidden = true;
            menus[1].hidden = true;
            return { menus: menus };
        });

        const jobs = this.state.jobIndex;
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
    showAndClear = () => {
        const menu = this.state.menus;
        menu[0].hidden = false;
        this.setState({
            menus: menu,
            newOrderMessage: '',
            newOrders: [],
            interval: null,
        }, () => {
            this.updateMenus();
        });
    }
    render() { 
        return (
            <>
                <button className='action' onClick={this.showAndClear} disabled={this.state.buttons[0].disabled}>Good Pieces</button>
                <Menu 
                    menus={this.state.menus}
                    buttons={this.state.buttons}
                    numPieces={this.state.numPieces}
                />
            </>
        );
    }
}
 
export default GoodPieces;