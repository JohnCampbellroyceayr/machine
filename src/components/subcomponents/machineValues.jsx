import React, { Component } from 'react';
import obj from '../../lib/textFileObj.js';
import Menu from './valuesMenu.jsx';
import file from '../../lib/file.js'
import time from '../../lib/time.js'
import './styling/employee.css'

//change
const curPath = 'C:\\Users\\John Campbell\\AppData\\Roaming\\IBM\\Client Access\\Emulator\\private'
const curPathServer = '\\\\192.168.0.13\\Engdrawing\\Inspection Logs\\Scanning Files'
//change

class machineValues extends Component {
    state = {
        Machine: obj.get('C:\\Users\\John Campbell\\AppData\\Roaming\\IBM\\Client Access\\Emulator\\private\\local files\\machine\\machine.txt'),
        menus: [
            {
                id: 0, 
                text: null, 
                class: 'default', 
                hidden: true
            },
        ],
        buttons: [
            {id: 0, text: "Change Machine"},
        ]
    }
    componentDidMount() {
        this.updateTextForMenu();
    }
    updateTextForMenu = () => {
        const machineMenu = this.renderMachineMenu();
        this.setState(prevState => {
            const menus = [...prevState.menus]
            menus[0].text = machineMenu;
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
        const newMachine = obj.get(curPath + '\\local files\\machine\\' + fileName);
        this.save(newMachine, curPath + '\\local files\\machine\\machine.txt');
        this.setState({ Machine: newMachine }, () => {
            this.updateTextForMenu();
        });
    }
    createNewMachine = (Machine) => {
        const depRes = Machine.split(" ");
        const machineGroup = obj.findMachineGroup(curPathServer + '\\machines\\MachineGroups.txt', "DFT" + depRes[0], depRes[1]);
        if (machineGroup !== false) {
            this.saveCurrentMachine();
            let newMachine = {};
            newMachine["Machine"] = Machine.replace(" ", "-");
            newMachine["MachineGroup"] = machineGroup;
            newMachine["Status"] = "Idle";
            newMachine["Jobs"] = "null";
            newMachine["Sequences"] = "null";
            newMachine["PartNumbers"] = "null";
            newMachine["JobStatus"] = "null";
            newMachine["GoodPieces"] = "null";
            newMachine["PiecesNeeded"] = "null";
            newMachine["ReportingSequence"] = "null";
            this.save(newMachine, curPath + '\\local files\\machine\\machine.txt');
            this.setState({ Machine: newMachine }, () => {
                this.updateTextForMenu();
            });
        }
        else {
            alert("Machine not found!")
        }
    }
    filterFileNames = (files) => {
        for (let i = 0; i < files.length; i++) {
            if(files[i] == "machine-data-macro.txt" || files[i] == "machine.txt" || files[i] == this.state.Machine["Machine"] + ".txt") {
                files.splice(i, 1);
                i--;
            }            
        }
        return files;
    }
    saveCurrentMachine = () => {
        const fileName = this.state.Machine["Machine"] + ".txt";
        this.save(this.state.Machine, curPath + '\\local files\\machine\\' + fileName);
    }
    
    renderMachineMenu() {
        const files = this.filterFileNames(file.getFileNames(curPath + '\\local files\\machine'));
        const machineMenu = files.map(file => {
            const machineObj = obj.get(curPath + '\\local files\\machine\\' + file);
            const machine = machineObj["Machine"];
            return (<div onClick={() => this.switchMachine(file)}>{machine}</div>)
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
    render() {
        const machine = this.state.Machine;
        return (
            <h2>
                Machine<br></br>
                {machine["Machine"]}
                <Menu 
                    menus={this.state.menus}
                    buttons={this.state.buttons}
                    class="small"
                /><br></br>
                Status<br></br>
                {machine["Status"]}
            </h2>
        );
    }
}
 
export default machineValues;