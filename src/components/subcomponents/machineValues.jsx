import React, { Component } from 'react';
import obj from '../../lib/textFileObj.js';
import Menu from './valuesMenu.jsx';
import file from '../../lib/file.js'
import Time from '../../lib/time.js'
import './styling/employee.css'
import MachineDisplay from './machineDisplay.jsx';
import MachineActions from './machineActions.jsx';

import filePath from '../../lib/fileLocations.js';

import serverFiles from './serverMachine.js';

class machineValues extends Component {
    state = {
        Employee: serverFiles.getCurrentEmployee(),
        Machine: serverFiles.getCurrentMachine(),
        menus: [
            {
                id: 0, 
                text: null, 
                class: 'default',
                hidden: true
            },
        ],
        buttons: [
            {id: 0, class: 'small', text: "Change Machine"},
        ],
        runVbCode: false,
    }
    componentDidMount() {
        this.updateTextForMenu();
        file.createFile(filePath("machineMacro"), "Macro" + '\t' + "null");
        file.createFile(filePath("machineGo"), "");
    }
    updateTextForMenu = () => {
        const machineMenu = this.renderMachineMenu();
        this.setState(prevState => {
            const menus = [...prevState.menus]
            menus[0].text = machineMenu;
            if (prevState.Machine == false) {
                prevState.buttons[0].disabled = true;
            }
            else {
                prevState.buttons[0].disabled = false;
            }
            return { menus: menus };
        });
    }
    keypressInputField = (e) => {
        if (e.keyCode === 13) {
            this.createNewMachine(e.target.value)
            e.target.value = "";
        }
    }
    save = (machineObj, filePath) => {
        let fileContent = '';
        for (const prop in machineObj) {
            if(Array.isArray(machineObj[prop])) {
                let propString = machineObj[prop][0];
                for (let i = 1; i < machineObj[prop].length; i++) {
                    propString += '\t' + machineObj[prop][i];
                }
                fileContent += `${prop}\t${propString}\n`;
            }
            else {
                fileContent += `${prop}\t${machineObj[prop]}\n`;
            }
        }
        file.createFile(filePath, fileContent);
    }

    switchMachine = (fileName) => {
        this.saveCurrentMachine();
        const machineName = fileName.replace(".txt", "");
        const newMachine = serverFiles.getExisting(machineName);
        if (newMachine != false) {
            serverFiles.changeEmployeeMachine(this.state.Employee["Number"], newMachine["Machine"]);
            this.save(newMachine, filePath("machineLocal"));
            this.setState({ Machine: newMachine }, () => {
                this.updateTextForMenu();
            });
        }
    }
    deleteMachine = () => {
        serverFiles.deleteMachine(this.state.Machine["Machine"]);
        this.deleteLocalMachine(this.state.Machine["Machine"]);
        const machineNames = this.filterFileNames(file.getFileNames(filePath("machineLocalDir")));
        if (machineNames.length == 0) {
            serverFiles.changeEmployeeMachine(this.state.Employee["Number"], "undefined");
            return true;
        }
        for (let i = 0; i < machineNames.length; i++) {
            const newMachine = serverFiles.getExisting(machineNames[i].replace(".txt", ""));
            if(newMachine != false) {
                this.setState({ Machine: newMachine });
                serverFiles.changeEmployeeMachine(this.state.Employee["Number"], newMachine["Machine"]);
                return true;
            }
        }
    }
    deleteLocalMachine = (machine) => {
        file.delete(filePath("machineLocalDir") + machine + ".txt");
    }
    createNewMachine = (Machine) => {
        const depRes = Machine.split(" ");
        const machineGroup = obj.findMachineGroup(filePath("machineGroup"), "DFT" + depRes[0], depRes[1]);
        if (machineGroup !== false) {
            this.saveCurrentMachine();
            let potentialNewMachine = {};
            potentialNewMachine["Machine"] = Machine.replace(" ", "-");
            potentialNewMachine["MachineGroup"] = machineGroup;
            potentialNewMachine["Status"] = "Idle";
            potentialNewMachine["Jobs"] = "null";
            potentialNewMachine["Sequences"] = "null";
            potentialNewMachine["PartNumbers"] = "null";
            potentialNewMachine["JobStatus"] = "null";
            potentialNewMachine["GoodPieces"] = "null";
            potentialNewMachine["PiecesNeeded"] = "null";
            potentialNewMachine["ReportingSequence"] = "null";
            let newMachine = serverFiles.createNew(potentialNewMachine);
            let alreadyInUse = false;
            if (newMachine == false) {
                newMachine = serverFiles.getExisting(potentialNewMachine["Machine"]);
                alreadyInUse = true;
            }
            this.save(newMachine, filePath("machineLocal"));
            serverFiles.changeEmployeeMachine(this.state.Employee["Number"], newMachine["Machine"]);
            this.setState({ Machine: newMachine }, () => {
                this.updateTextForMenu();
                if (alreadyInUse == false) {
                    const macroFileText = "Macro" + '\t' + "Start Shift";
                    file.createFile(filePath("machineMacro"), macroFileText);
                    const employee = obj.get(filePath("employeeLocal"))["Number"];
                    const machine = this.state.Machine["Machine"];
                    const writeString = employee + '\t' + "Started on" + '\t' + machine + '\t' + Time.getDateTime();
                    file.addToFile(filePath("employeeLog"), writeString);
                    this.setState({ runVbCode: true });
                }
            });
            return true;
        }
        else {
            alert("Machine not found!")
        }
    }
    filterFileNames = (files) => {
        for (let i = 0; i < files.length; i++) {
            const fileName = files[i].replace(".txt", "");
            if(fileName == "machine-data-macro" || fileName == "machine" || this.state.Machine["Machine"] == fileName || fileName == "machine-go" || serverFiles.getExisting(fileName) == false) {
                files.splice(i, 1);
                i--;
            }            
        }
        return files;
    }
    saveCurrentMachine = () => {
        const fileName = this.state.Machine["Machine"] + ".txt";
        this.save(this.state.Machine, filePath("machineLocalDir") + fileName);
    }
    
    removeFaultyPartNumbers = () => {
        this.setState({ Machine: obj.get(filePath("machineLocal")) }, () => {
            const machine = this.state.Machine;
            let jobs = machine["Jobs"];
            let seq = machine["Sequences"];
            let parts = machine["PartNumbers"];
            if (Array.isArray(jobs) && Array.isArray(parts)) {
                for (let i = 0; i < jobs.length; i++) {
                    if (parts[i] == undefined && jobs[i] != undefined) {
                        jobs.splice(i, 1);
                        seq.splice(i, 1);
                        i--;
                    }            
                }
            }
            else if(Array.isArray(jobs) && !Array.isArray(parts)) {
                if (parts == "null" || parts == undefined) {
                    jobs.splice(1, jobs.length - 1);
                    seq.splice(1, jobs.length - 1);
                    jobs = "null";
                    seq = "null";
                }
                else {
                    jobs.splice(1, jobs.length - 1);
                    seq.splice(1, jobs.length - 1);
                }
            }
            else {
                if (parts == "null" || parts == undefined) {
                    jobs = "null";
                    seq = "null";
                }
            }
            machine["Jobs"] = jobs;
            machine["Sequences"] = seq;
            machine["PartNumbers"] = parts;

            this.save(machine, filePath("machineLocal"));
        });
    }

    renderMachineMenu() {
        const files = this.filterFileNames(file.getFileNames(filePath("machineLocalDir")));
        const machineMenu = files.map(file => {
            const machineObj = obj.get(filePath("machineLocalDir") + file);
            const machine = machineObj["Machine"];
            if (machine != undefined) {
                return (<div onClick={() => this.switchMachine(file)}>{this.removeDashesFromText(machine)}</div>);
            }
        });
        return (
            <div>
                <br></br>
                Enter new machine<br></br>
                <input type='text' onKeyDown={(e) => this.keypressInputField(e)}></input><br></br>
                or select other machine
                <div className='chooseOtherEmployeeMenu'>
                    {machineMenu}
                </div>
            </div>
        );
    }

    //--saving for actions
    saveProps = (propsArray, valuesArray) => {
        var machine = this.state.Machine;
        for (let i = 0; i < propsArray.length; i++) {
            if (valuesArray[i] != []) {
                if(Array.isArray(valuesArray[i])) {
                    if (machine[propsArray[i]] == "null" || machine[propsArray[i]] == undefined) {
                        machine[propsArray[i]] = valuesArray[i]
                    }
                    else if(Array.isArray(machine[propsArray[i]])) {
                        for (let j = 0; j < valuesArray[i].length; j++) {
                            machine[propsArray[i]].push(valuesArray[i][j]);
                        }
                    }
                    else {
                        valuesArray[i].splice(0, 0, machine[propsArray[i]]);
                        machine[propsArray[i]] = valuesArray[i];
                    }
                }
                else {
                    machine[propsArray[i]] = valuesArray[i];
                }
            }
        }
        this.setState({ Machine: machine }, () => {
            this.save(this.state.Machine, filePath("machineLocal"));

            serverFiles.saveMachine(this.state.Machine);
        });
    }

    saveGoodPieces = (order, addedpiece) => {
        let orders = this.state.Machine["Jobs"];
        if (!Array.isArray(orders)) {
           orders = [orders];
        }
        for (let i = 0; i < orders.length; i++) {
            if(orders[i] == order) {
                const machine = this.state.Machine;
                let pieces = machine["GoodPieces"];
                if (Array.isArray(pieces)) {
                    const piece = pieces[i];
                    const newPieces = (parseInt(piece) + parseInt(addedpiece)).toString();
                    pieces[i] = newPieces;
                }
                else {
                    const piece = pieces;
               
                    const newPieces = (parseInt(piece) + parseInt(addedpiece)).toString();
                    pieces = newPieces;
                }
                this.setState(prevState => {
                    
                    // // pieces[i] = (parseInt(piece) + parseInt(pieces[i])).toString();
                    prevState.Machine["GoodPieces"] = pieces;
                    return { Machine: prevState.Machine };
                });
                return ;
            }            
        }
    }

    changeStatus = (newStatus) => {
        if (newStatus !== this.state.Machine["Status"]) {
            this.setState(prevState => {
                const machine = prevState.Machine;
                machine["Status"] = newStatus;
                return { Machine: prevState.Machine };
            }, () => {
                serverFiles.saveMachine(this.state.Machine)
            });
        }
    }
    render() {
        const machine = this.state.Machine;
        return (
            <>
                <div className='titleValue'>Machine:</div> 
                {" " + this.removeDashesFromText(machine["Machine"])}
                <Menu 
                    menus={this.state.menus}
                    buttons={this.state.buttons}
                    class="small"
                /><br></br>
                <div className='titleValue'>Status:</div>
                {" " + this.removeDashesFromText(machine["Status"])}
                <br></br>
                <MachineDisplay Machine={this.state.Machine}/>
                <MachineActions runVbCode={this.state.runVbCode} deleteMachine={this.deleteMachine} changeStatus={this.changeStatus} createNewMachine={this.createNewMachine} saveProps={this.saveProps} Machine={this.state.Machine} Employee={this.state.Employee} removeFaultyPartNumbers={this.removeFaultyPartNumbers} saveGoodPieces={this.saveGoodPieces}/>
            </>
        );
    }
    removeDashesFromText(text) {
        if (text != undefined && text != "undefined") {
            return text.replaceAll("-", " ");
        }
        return '';
    }
}
 
export default machineValues;