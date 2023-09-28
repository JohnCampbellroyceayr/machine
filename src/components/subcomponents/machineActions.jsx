import React, { Component, useState } from 'react';
import file from '../../lib/file.js';
import Time from '../../lib/time.js';
import obj from '../../lib/textFileObj.js';

import StartShift from './actions/startShift.jsx';
import Setup from './actions/setup.jsx';
import Run from './actions/run.jsx';
import Pause from './actions/pause.jsx';
import Play from './actions/play.jsx';
import GoodPieces from './actions/goodPieces.jsx';
import Scrap from './actions/scrap.jsx';
import filePath from '../../lib/fileLocations.js';
import Menu from './statusMenu.jsx';

class Actions extends Component {
    state = {
        menu: {id: 0, text: '', class: 'default-big', hidden: true, ref: React.createRef()},
        vbscriptRunning: false,
        timer: null
    }
    componentDidMount() {
        const status = file.read(filePath("machineGo"));
        this.getHtmlForMenu(status);
    }
    startVbScriptCode = () => {
        file.createFile(filePath("machineGo"), "Not empty");
        this.setState(prevState => {
            const menu = prevState.menu;
            menu.hidden = false;
            const interval = setInterval(() => {
                this.update();
            }, 1000);
            return { menu: menu, vbscriptRunning: true, timer: interval };
        }, () => {
            this.update();
        });
    }
    update = () => {
        if (this.state.timer != null) {
            const status = file.read(filePath("machineGo"));
            if (status.includes("Success") || status.includes("Error")) {
                this.setState(prevState => {
                    clearInterval(prevState.timer);
                    return { timer: null };
                });
            }
            this.getHtmlForMenu(status);
        }
    }
    getHtmlForMenu = (status) => {
        let text;
        if (status.includes("Working")) {
            text = "Working ....";
        }
        else if(status.includes("Not")) {
            text = "Processing ....";
        }
        else if(status.includes("Error")) {
            this.props.removeFaultyPartNumbers();
            const error = status.split("|")[1];

            const restartFunction = () => {
                file.createFile(filePath("machineGo"), "RunAgain|"); 
                this.closeApplication();
            }
            const closeFunction = () => {
                file.createFile(filePath("machineGo"), "Donotrun|"); 
                this.closeApplication();
            }
            file.createFile(filePath("machineGo"), "waitforinput|"); 
            text = (
                <div>
                    <div>
                        Error while operating:<br></br>
                        {error}
                    </div>
                    <div>
                        Press the 'restart' button to run the program again, or press the cancel button to be done.
                    </div>

                    <button className='pick-menu' onClick={restartFunction}>Restart</button>
                    <button className='pick-menu' onClick={closeFunction}>Cancel</button>
                </div>
            );
        }
        else if(status.includes("Message")) {
            let message = status.split("|")[1];
            message = message.split('\n');
            let question = '';
            for (let i = 0; i < message.length; i++) {
                const line = message[i];
                question = (
                    <>
                        {question}
                        {line}
                        <br></br>
                    </>
                )
            }
            text = (
                <div>
                    <div>
                        Message:<br></br>
                        {question}<br></br>
                        <input type='text' placeholder='enter option' onKeyDown={(e) => this.receiveInputKey(e)} ref={this.state.menu.ref}/>
                    </div>
                </div>
            );
        }
        else if(status.includes("Success")) {
            text = (
                <div>
                    <div>
                        Operation successful, press the OK button to accept.
                    </div>
                    <button className='pick-menu' onClick={() => {this.closeApplication()}}>OK</button>
                </div>
            );
        }
        else {
            return '';
        }
        this.setState(prevState => {
            const menu = prevState.menu;
            menu.text = text;
            return { menu: menu };
        }, () => {
            if (status.includes("Message")) {
                this.state.menu.ref.current.focus();
            }
        });
    }

    receiveInputKey = (e) => {
        if (e.keyCode === 13) {
            this.sendMessageBack(e.target.value);
            e.target.value = "";
        }
    }

    sendMessageBack = (message) => {
        const str = message.replace(/\s/g, "") + "|";
        file.createFile(filePath("machineGo"), str);
    }

    closeApplication = () => {
        var win = nw.Window.get();
        win.close(true);
        window.close(true);
    }

    startShift = (value) => {
        if(this.props.createNewMachine(value)) {
            this.startVbScriptCode();    
            return true;
        }
    }
    setup = (jobs, seq) => {
        this.props.saveProps(["Jobs", "Sequences"], [jobs, seq]);
        const macroFileText = "Macro" + '\t' + "Setup";
        file.createFile(filePath("machineMacro"), macroFileText);
        this.props.changeStatus("Working");
        this.startVbScriptCode();
    }
    run = (jobs, seq, indexArray) => {
        if (jobs.length != 0) {
            this.props.saveProps(["Jobs", "Sequences"], [jobs, seq]);
        }
        else {
            this.props.saveProps([], []);
        }
        let orderString = "";
        for (let i = 0; i < indexArray.length; i++) {
            const order = (Array.isArray(this.props.Machine["Jobs"])) ? this.props.Machine["Jobs"][indexArray[i]] : this.props.Machine["Jobs"];
            orderString += '\t' + order;
        }
        for (let j = 0; j < jobs.length; j++) {
            orderString += '\t' + jobs[j];
        }
        let macroFileText = "Macro" + '\t' + "Run" + '\n';
        macroFileText += "Order" + orderString + '\n';
        file.createFile(filePath("machineMacro"), macroFileText);
        this.props.changeStatus("Working");
        this.startVbScriptCode();
    }
    pause = () => {
        let macroFileText = "Macro" + '\t' + "Pause" + '\n';
        file.createFile(filePath("machineMacro"), macroFileText);
        this.props.saveProps([], []);
        this.props.changeStatus("Paused");
        this.startVbScriptCode();
    }
    play = () => {
        let macroFileText = "Macro" + '\t' + "Resume" + '\n';
        file.createFile(filePath("machineMacro"), macroFileText);
        this.props.saveProps([], []);
        if (this.props.Machine["Jobs"] != "null" && this.props.Machine["Jobs"] != undefined) {
            this.props.changeStatus("Working");
        }
        else {
            this.props.changeStatus("Idle");
        }
        this.startVbScriptCode();
    }
    scanGoodPieces = (orders, pieces) => {
        this.props.saveProps([], []);
        let orderString = "";
        let piecesString = "";
        for (let i = 0; i < orders.length; i++) {
            const order = (Array.isArray(this.props.Machine["Jobs"])) ? this.props.Machine["Jobs"][orders[i]] : this.props.Machine["Jobs"];
            const numpieces = pieces[i];
            orderString += '\t' + order;
            piecesString += '\t' + numpieces;
        }
        let macroFileText = "Macro" + '\t' + "GoodPieces" + '\n';
        macroFileText += "Order" + orderString + '\n';
        macroFileText += "Pieces" + piecesString + '\n';
        file.createFile(filePath("machineMacro"), macroFileText);
        this.startVbScriptCode();
    }
    scanScrap = (order, pieces, reason) => {
        const orderString = (Array.isArray(this.props.Machine["Jobs"])) ? this.props.Machine["Jobs"][order] : this.props.Machine["Jobs"];
        this.props.saveProps([], []);
        let macroFileText = "Macro" + '\t' + "Scrap" + '\n';
        macroFileText += "Order" + '\t' + orderString + '\n';
        macroFileText += "Pieces" + '\t' + pieces + '\n';
        if (reason != undefined) {
            macroFileText += "Reason" + '\t' + reason + '\n';
        }
        file.createFile(filePath("machineMacro"), macroFileText);
        this.startVbScriptCode();
    }
    render() { 
        return (
            <>
                <StartShift startShift={this.startShift} status={this.props.Machine["Status"]}/>
                <Setup setup={this.setup} status={this.props.Machine["Status"]}/>
                <Run run={this.run} jobs={this.props.Machine["Jobs"]} status={this.props.Machine["Status"]}/>
                <Pause machine={this.props.Machine} pause={this.pause} status={this.props.Machine["Status"]}/>
                <Play play={this.play} status={this.props.Machine["Status"]}/>
                <GoodPieces jobs={this.props.Machine["Jobs"]} goodPieces={this.props.Machine["GoodPieces"]} requiredPieces={this.props.Machine["PiecesNeeded"]} scanGoodPieces={this.scanGoodPieces} status={this.props.Machine["Status"]}/>
                <Scrap jobs={this.props.Machine["Jobs"]} report={this.props.Machine["ReportingSequence"]} scanScrap={this.scanScrap} status={this.props.Machine["Status"]}/>

                <Menu menu={this.state.menu} />
            </>
        );
    }
}
 
export default Actions;