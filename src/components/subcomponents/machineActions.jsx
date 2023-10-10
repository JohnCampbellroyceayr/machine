import React, { Component, useState } from 'react';
import file from '../../lib/file.js';
import Time from '../../lib/time.js';
import obj from '../../lib/textFileObj.js';
import serverFiles from './serverMachine.js';

import StartShift from './actions/startShift.jsx';
import Setup from './actions/setup.jsx';
import Run from './actions/run.jsx';
import Pause from './actions/pause.jsx';
import Play from './actions/play.jsx';
import GoodPieces from './actions/goodPieces.jsx';
import Scrap from './actions/scrap.jsx';
import EndShift from './actions/signout.jsx';
import filePath from '../../lib/fileLocations.js';
import Menu from './statusMenu.jsx';

class Actions extends Component {
    state = {
        menu: {id: 0, text: '', class: 'default-big', hidden: true, ref: React.createRef()},
        vbscriptRunning: false,
        timer: null
    }
    componentDidUpdate(prevProps) {
        if (prevProps.runVbCode != this.props.runVbCode) {
            this.startVbScriptCode();
        }
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
        file.createFile(filePath("machineGo"), "Not empty");
    }

    logMachineNoReportSeq = (op, order, seq) => {
        let text = op + '\t';
        text += order + '\t';
        text += seq + '\t';
        text += Time.getDateTime() + '\t';
        text += this.props.Machine["Machine"] + '\t';
        text += this.props.Employee["Number"] + '\t';
        file.addToFile(filePath("machineLog"), text);
    }

    startShift = (value) => {
        if(this.props.createNewMachine(value)) {
            this.startVbScriptCode();    
            return true;
        }
    }
    setup = async (orders) => {
        if (orders.length > 0) {
            let job = [];
            let seq = [];
            let part = [];
            let report = [];
            let goodPieces = [];
            let piecesNeeded = [];
            for (let i = 0; i < orders.length; i++) {
                job.push(orders[i].job);
                seq.push(orders[i].seq);
                part.push(orders[i].part);
                report.push(orders[i].report);
                goodPieces.push(orders[i].goodPieces);
                piecesNeeded.push(orders[i].piecesNeeded);
            }
            await this.props.saveProps(["Jobs", "Sequences", "PartNumbers", "ReportingSequence", "GoodPieces", "PiecesNeeded"], [job, seq, part, report, goodPieces, piecesNeeded]);
            const macroFileText = "Macro" + '\t' + "Setup";
            file.createFile(filePath("machineMacro"), macroFileText);
            this.props.changeStatus("Setup");
            this.startVbScriptCode();
            const jobs = this.props.Machine["Jobs"];
            const seqs = this.props.Machine["Sequences"];
            const reports = this.props.Machine["ReportingSequence"];
            if (Array.isArray(jobs)) {
                for (let i = 0; i < jobs.length; i++) {
                    if (reports[i] == "N") {
                        this.logMachineNoReportSeq("Setup", jobs[i], seqs[i]);
                    }
                }
            }
            else {
                if (reports == "N") {
                    this.logMachineNoReportSeq("Setup", jobs, seqs);
                }
            }
        }
    }
    run = async (orders) => {
        let job = [];
        let seq = [];
        let part = [];
        let report = [];
        let goodPieces = [];
        let piecesNeeded = [];
        for (let i = 0; i < orders.length; i++) {
            job.push(orders[i].job);
            seq.push(orders[i].seq);
            part.push(orders[i].part);
            report.push(orders[i].report);
            goodPieces.push(orders[i].goodPieces);
            piecesNeeded.push(orders[i].piecesNeeded);
        }
        await this.props.saveProps(["Jobs", "Sequences", "PartNumbers", "ReportingSequence", "GoodPieces", "PiecesNeeded"], [job, seq, part, report, goodPieces, piecesNeeded]);
        const macroFileText = "Macro" + '\t' + "Run";
        file.createFile(filePath("machineMacro"), macroFileText);
        this.props.changeStatus("Run");
        this.startVbScriptCode();
        const jobs = this.props.Machine["Jobs"];
        const seqs = this.props.Machine["Sequences"];
        const reports = this.props.Machine["ReportingSequence"];
        if (Array.isArray(jobs)) {
            for (let i = 0; i < jobs.length; i++) {
                if (reports[i] == "N") {
                    this.logMachineNoReportSeq("Run", jobs[i], seqs[i]);
                }
            }
        }
        else {
            if (reports == "N") {
                this.logMachineNoReportSeq("Run", jobs, seqs);
            }
        }
    }
    pause = () => {
        let macroFileText = "Macro" + '\t' + "Pause" + '\n';
        file.createFile(filePath("machineMacro"), macroFileText);
        this.props.saveProps([], []);
        const oldStatus = this.props.Machine["Status"];
        this.props.changeStatus(oldStatus + "-Paused");
        this.startVbScriptCode();
    }
    play = () => {
        let macroFileText = "Macro" + '\t' + "Resume" + '\n';
        file.createFile(filePath("machineMacro"), macroFileText);
        this.props.saveProps([], []);
        if (this.props.Machine["Jobs"] != "null" && this.props.Machine["Jobs"] != undefined) {
            const oldStatus = this.props.Machine["Status"].split("-")[0];
            this.props.changeStatus(oldStatus);
        }
        else {
            this.props.changeStatus("Idle");
        }
        this.startVbScriptCode();
    }
    scanGoodPieces = async (orders, pieces) => {
        let orderString = "";
        let piecesString = "";
        const order = (Array.isArray(this.props.Machine["Jobs"])) ? this.props.Machine["Jobs"][orders[0]] : this.props.Machine["Jobs"];
        const numpieces = pieces[0];
        await this.props.saveGoodPieces(order, numpieces);
        
        await this.props.saveProps([], []);
        let macroFileText = "Macro" + '\t' + "GoodPieces" + '\n';
        macroFileText += "Order" + '\t' + order + '\n';
        macroFileText += "Pieces" + '\t' + numpieces + '\n';
        file.createFile(filePath("machineMacro"), macroFileText);
        this.startVbScriptCode();

        const reports = this.props.Machine["ReportingSequence"];
        if (Array.isArray(reports)) {
            if (reports[orders] == "N") {
                this.logMachineNoReportSeq("Good Pieces", order, "");
            }
        }
        else {
            if (reports == "N") {
                this.logMachineNoReportSeq("Good Pieces", order, "");
            }
        }
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
    endShift = () => {
        let macroFileText = "Macro" + '\t' + "EndShift" + '\n';
        macroFileText += "Machine" + '\t' + this.props.Machine["Machine"] + '\n';
        file.createFile(filePath("machineMacro"), macroFileText)
        this.props.deleteMachine()
        this.startVbScriptCode();    
        return true;
    }
    render() {
        return (
            <>
                <StartShift startShift={this.startShift} status={this.props.Machine["Status"]}/>
                <Setup logMachineNoReportSeq={this.logMachineNoReportSeq} setup={this.setup} status={this.props.Machine["Status"]}/>
                <Run logMachineNoReportSeq={this.logMachineNoReportSeq} run={this.run} jobs={this.props.Machine["Jobs"]} seq={this.props.Machine["Sequences"]} status={this.props.Machine["Status"]}/>
                <Pause machine={this.props.Machine} pause={this.pause} status={this.props.Machine["Status"]}/>
                <Play play={this.play} status={this.props.Machine["Status"]}/>
                <GoodPieces logMachineNoReportSeq={this.logMachineNoReportSeq} jobs={this.props.Machine["Jobs"]} goodPieces={this.props.Machine["GoodPieces"]} requiredPieces={this.props.Machine["PiecesNeeded"]} scanGoodPieces={this.scanGoodPieces} status={this.props.Machine["Status"]}/>
                <Scrap logMachineNoReportSeq={this.logMachineNoReportSeq} jobs={this.props.Machine["Jobs"]} report={this.props.Machine["ReportingSequence"]} scanScrap={this.scanScrap} status={this.props.Machine["Status"]}/>
                <EndShift endShift={this.endShift} status={this.props.Machine["Status"]} machine={this.props.Machine["Machine"]} />
                <br></br>
                <br></br>
                <Menu menu={this.state.menu} />
                <button className='pick-menu' onClick={() => {this.closeApplication()}}>Close</button>
            </>
        );
    }
}
 
export default Actions;