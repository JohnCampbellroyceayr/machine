import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';

class GoodPieces extends Component {
    state = {
        menus: [
            {id: 0, text: null, class: 'default', hidden: true, ref: React.createRef()},
            {id: 1, text: null, class: 'default', hidden: true, ref: React.createRef(), ref2: React.createRef()},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Good Pieces"},
            {id: 1, class: 'none', text: "Yes"},
        ],
        setupMenus: [
        ],
        setupButtons: [
        ],
        oneOrder: null,
        jobs: [],
        seq: [],
        oldJobIndex: []
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            console.log("adf");
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
        const text = (<h2>Do you want to run more than 1 job? Enter = No </h2>);
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
            return { menus: menus, oneOrder: bool, jobs: [], seq: [], oldJobIndex: []};
        }, () => {
            this.state.menus[index].ref.current.focus();
        });
    }
    renderOrderMenu(index) {
        const machineJobs = (Array.isArray(this.props.jobs)) ? this.props.jobs : [this.props.jobs];

        const jobs = (machineJobs.length == 0 || machineJobs == "null" || machineJobs == undefined) ? '' : machineJobs.map((job, i) => {
            const ref = React.createRef();
            const onclick = () => {
                this.enterOldToRun(i, ref);
            };
            return <button key={i} className='pick-menu' onClick={onclick} ref={ref}>{job}</button>
        });
        const inputOrder = (<input type='text' placeholder='order' onKeyDown={(e) => this.setupKeyPress(e, "order")} ref={this.state.menus[index].ref}></input>);
        const inputSeq = (<input type='text' placeholder='seq' onKeyDown={(e) => this.setupKeyPress(e, "seq")} ref={this.state.menus[index].ref2}></input>);
        const enterBtn = (<button className='pick-menu' onClick={() => this.run()}>Run</button>);
        const html = (
            <div>
                Select job:<br></br>
                {jobs}<br></br>
                Or enter new job:<br></br>
                Order number:<br></br>
                {inputOrder}<br></br>
                Sequence:<br></br>
                {inputSeq}<br></br>
                {enterBtn}
            </div>
        )
        return html;
    }
    setupKeyPress = (e, type) => {
        if (e.keyCode === 13) {
            this.enterJob(e.target.value, type);
        }
    }
    enterOldToRun = (index, btnRef) => {
        this.setState(prevState => {
            const indexArray = [...prevState.oldJobIndex]
            if (indexArray.includes(index)) {
                for (let j = 0; j < indexArray.length; j++) {
                    if(indexArray[j] == index) {
                        indexArray.splice(j, 1);
                    }                    
                }
                btnRef.current.style.backgroundColor = '';
            }
            else {
                indexArray.push(index);
                btnRef.current.style.backgroundColor = "red";
            }
            return { oldJobIndex: indexArray };
        }, () => {
            if (this.state.oneOrder == true) {
                this.run();
            }
        });
    }
    enterJob = (value, type) => {
        if (type == "order") {
            if(value != "") {
                this.state.menus[1].ref2.current.focus();
            }
            else {
                this.run();
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
                    this.run();
                }
            });
        }
    }
    run = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].hidden = true;
            menus[1].hidden = true;
            return { menus: menus };
        });
        this.props.run(this.state.jobs, this.state.seq, this.state.oldJobIndex);
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
 
export default GoodPieces;