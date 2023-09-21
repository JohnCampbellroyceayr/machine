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

class Actions extends Component {
    startShift = (value) => {
        if(this.props.createNewMachine(value)) {
            return true;
        }
    }
    setup = (jobs, seq) => {
        this.props.saveProps(["Jobs", "Sequences"], [jobs, seq]);
        const macroFileText = "Macro" + '\t' + "Setup";
        file.createFile(filePath("machineMacro"), macroFileText);
        this.props.changeStatus("Working");
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
    }
    pause = () => {
        let macroFileText = "Macro" + '\t' + "Pause" + '\n';
        file.createFile(filePath("machineMacro"), macroFileText);
        this.props.saveProps([], []);
        this.props.changeStatus("Paused");
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
    }
    scanScrap = (order, pieces) => {
        const orderString = (Array.isArray(this.props.Machine["Jobs"])) ? this.props.Machine["Jobs"][order] : this.props.Machine["Jobs"];
        this.props.saveProps([], []);
        let macroFileText = "Macro" + '\t' + "Scrap" + '\n';
        macroFileText += "Order" + '\t' + orderString + '\n';
        macroFileText += "Pieces" + '\t' + pieces + '\n';
        file.createFile(filePath("machineMacro"), macroFileText);
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
                <Scrap jobs={this.props.Machine["Jobs"]} scanScrap={this.scanScrap} status={this.props.Machine["Status"]}/>
            </>
        );
    }
}
 
export default Actions;