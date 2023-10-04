import React, { Component } from 'react';
import obj from '../../lib/textFileObj.js';
import Menu from './valuesMenu.jsx';
import file from '../../lib/file.js'
import Time from '../../lib/time.js'
import './styling/employee.css'

import filePath from '../../lib/fileLocations.js';

import serverFiles from './serverMachine.js';

class employeeValues extends Component {
    state = {
        Employee: serverFiles.getCurrentEmployee(),
        menus: [
            {
                id: 0, 
                text: null, 
                class: 'default', 
                hidden: true
            },
        ],
        buttons: [
            {id: 0, class: 'small', text: "Change Employee"},
        ]
    }
    componentDidMount() {
        this.updateTextForMenu();
    }
    updateTextForMenu = () => {
        const empMenu = this.renderEmployeeMenu();
        this.setState(prevState => {
            const menus = [...prevState.menus]
            menus[0].text = empMenu;
            return { menus: menus };
        });
    }
    keypressInputField = (e) => {
        if (e.keyCode === 13) {
            this.createNewEmployee(e.target.value)
            e.target.value = "";
        }
    }
    save = (employeeObj, filePath) => {
        let fileContent = '';
        for (const prop in employeeObj) {
            fileContent += `${prop}\t${employeeObj[prop]}\n`;
        }
        file.createFile(filePath, fileContent);
    }

    switchEmployee = (fileName) => {
        this.saveCurrentEmployee();
        const newEmployee = obj.get(filePath("employeeLocalDir") + fileName);
        this.save(newEmployee, filePath("employeeLocal"));
        this.setState({ Employee: newEmployee }, () => {
            this.updateTextForMenu();
        });
    }
    //asdf
    createNewEmployee = (employeeNumber) => {
        const employeeName = obj.findNameValue(filePath("employeeList"), employeeNumber);
        if (employeeName !== false) {
            this.saveCurrentEmployee();
            let newEmployee = {};
            newEmployee["Number"] = employeeNumber;
            newEmployee["Name"] = employeeName;
            newEmployee["Status"] = "Working";
            newEmployee["LastChanged"] = Time.getTime();
            this.save(newEmployee, filePath("employeeLocal"));
            const employee = newEmployee["Number"];

            const machine = obj.get(filePath("machineLocal"))["Machine"];
            let writeString = employee + '\t' + "Start Shift" + '\t' + Time.getDateTime();
            writeString = employee + '\t' + "Started on" + '\t' + machine + '\t' + Time.getDateTime() + '\n' + writeString;
            file.addToFile(filePath("employeeLog"), writeString);

            this.setState({ Employee: newEmployee }, () => {
                this.updateTextForMenu();
            });
        }
        else {
            alert("Employee Number not found!");
        }
    }
    filterFileNames = (files) => {
        for (let i = 0; i < files.length; i++) {
            if(files[i] == "employee-data-macro.txt" || files[i] == "employee.txt" || files[i] == this.state.Employee["Number"] + ".txt") {
                files.splice(i, 1);
                i--;
            }            
        }
        return files;
    }
    saveCurrentEmployee = () => {
        const fileName = this.state.Employee["Number"] + ".txt";
        this.save(this.state.Employee, filePath("employeeLocalDir") + fileName);
    }
    
    renderEmployeeMenu() {
        const files = this.filterFileNames(file.getFileNames(filePath("employeeLocalDir")));
        const employeeMenu = files.map(file => {
            const employeeObj = obj.get(filePath("employeeLocalDir") + file);
            const number = employeeObj["Number"];
            const name = employeeObj["Name"];
            return (<div onClick={() => this.switchEmployee(file)}>{number}{" "}{name}</div>)
        });
        return (
            <div>
                <br></br>
                Enter new employee<br></br>
                <input type='text' onKeyDown={(e) => this.keypressInputField(e)}></input><br></br>
                or select other employee
                <div className='chooseOtherEmployeeMenu'>
                    {employeeMenu}
                </div>
            </div>
        );
    }
    render() {
        const employee = this.state.Employee;
        return (
            <>
                <div className='titleValue'>Employee:</div>
                {" " + employee["Number"]}
                {" "}
                {this.removeDashesFromText(employee["Name"])}
                <br></br>
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
 
export default employeeValues;