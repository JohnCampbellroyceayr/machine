import React, { Component, useState } from 'react';
import Menu from './valuesMenu.jsx';
import file from '../../lib/file.js';

import StartShift from './actions/startShift.jsx';
import Setup from './actions/setup.jsx';
import Run from './actions/run.jsx';
import Pause from './actions/pause.jsx';
import Play from './actions/play.jsx';
import GoodPieces from './actions/goodPieces.jsx';
import Scrap from './actions/scrap.jsx';

//change
const curPath = 'C:\\Users\\John Campbell\\AppData\\Roaming\\IBM\\Client Access\\Emulator\\private'
const curPathServer = '\\\\192.168.0.13\\Engdrawing\\Inspection Logs\\Scanning Files'
//change

class Actions extends Component {
    state = {
        jobText: null,
        partNumberText: null,
        menus: [
            {id: 0, text: "Bro Hello", class: 'default', hidden: true, ref: React.createRef()},
            {id: 1, text: "Bro asdfasdfasdfHello", class: 'default', hidden: true, ref: React.createRef()},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Report Good Pcs"},
            {id: 1, class: 'action', text: "Report scrap"},
        ],
        setupJobs: []
    }
    componentDidMount() {
        this.updateTextMenus();
    }
    updateTextMenus = () => {

    }
    startShift = (value) => {
        if(this.props.createNewMachine(value)) {
            const macroFileText = "Macro" + '\t' + "Start Shift";
            file.createFile(curPath + "\\local files\\machine\\machine-data-macro.txt", macroFileText);
            return true;
        }
    }
    setup = (jobs, seq) => {
        this.props.saveProps(["Jobs", "Sequences"], [jobs, seq]);
        const macroFileText = "Macro" + '\t' + "Setup";
        file.createFile(curPath + "\\local files\\machine\\machine-data-macro.txt", macroFileText);
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
        file.createFile(curPath + "\\local files\\machine\\machine-data-macro.txt", macroFileText);
    }
    pause = () => {
        let macroFileText = "Macro" + '\t' + "Pause" + '\n';
        file.createFile(curPath + "\\local files\\machine\\machine-data-macro.txt", macroFileText);
        this.props.saveProps([], []);
    }
    play = () => {
        let macroFileText = "Macro" + '\t' + "Resume" + '\n';
        file.createFile(curPath + "\\local files\\machine\\machine-data-macro.txt", macroFileText);
        this.props.saveProps([], []);
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
        file.createFile(curPath + "\\local files\\machine\\machine-data-macro.txt", macroFileText);
    }
    scanScrap = (order, pieces) => {
        this.props.saveProps([], []);
        let macroFileText = "Macro" + '\t' + "Scrap" + '\n';
        macroFileText += "Order" + '\t' + order + '\n';
        macroFileText += "Pieces" + '\t' + pieces + '\n';
        file.createFile(curPath + "\\local files\\machine\\machine-data-macro.txt", macroFileText);
    }
    render() { 
        return (
            <>
            <StartShift startShift={this.startShift}/>
            <Setup setup={this.setup}/>
            <Run run={this.run} jobs={this.props.Machine["Jobs"]}/>
            <Pause machine={this.props.Machine} pause={this.pause}/>
            <Play play={this.play}/>
            <GoodPieces jobs={this.props.Machine["Jobs"]} goodPieces={this.props.Machine["GoodPieces"]} requiredPieces={this.props.Machine["PiecesNeeded"]} scanGoodPieces={this.scanGoodPieces}/>
            <Scrap jobs={this.props.Machine["Jobs"]} scanScrap={this.scanScrap}/>
            <br></br>
            {/* <Menu 
                menus={this.state.menus}
                buttons={this.state.buttons}
            /> */}
            </>
        );
    }
}
 
export default Actions;