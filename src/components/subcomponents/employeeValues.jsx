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

class employeeValues extends Component {
    state = {
        Employee: obj.get(curPath + '\\local files\\employee\\employee.txt'),
        menus: [
            {
                id: 0, 
                text: null, 
                class: 'default', 
                hidden: true
            },
        ],
        buttons: [
            {id: 0, text: "Change Employee"},
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
        const newEmployee = obj.get(curPath + '\\local files\\employee\\' + fileName);
        this.save(newEmployee, curPath + '\\local files\\employee\\employee.txt');
        this.setState({ Employee: newEmployee }, () => {
            this.updateTextForMenu();
        });
    }
    //asdf
    createNewEmployee = (employeeNumber) => {
        const employeeName = obj.findNameValue(curPathServer + '\\employees\\EmployeeList.txt', employeeNumber);
        if (employeeName !== false) {
            this.saveCurrentEmployee();
            let newEmployee = {};
            newEmployee["Number"] = employeeNumber;
            newEmployee["Name"] = employeeName;
            newEmployee["Status"] = "Working";
            newEmployee["LastChanged"] = time.getTime();
            this.save(newEmployee, curPath + '\\local files\\employee\\employee.txt');
            this.setState({ Employee: newEmployee }, () => {
                this.updateTextForMenu();
            });
        }
        else {
            alert("Employee Number not found!")
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
        this.save(this.state.Employee, curPath + '\\local files\\employee\\' + fileName);
    }
    
    renderEmployeeMenu() {
        const files = this.filterFileNames(file.getFileNames(curPath + '\\local files\\employee'));
        const employeeMenu = files.map(file => {
            const employeeObj = obj.get(curPath + '\\local files\\employee\\' + file);
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
            <h2>
                Employee<br></br>
                {employee["Number"]}
                {" "}
                {employee["Name"]}
                <Menu 
                    menus={this.state.menus}
                    buttons={this.state.buttons}
                    class="small"
                />
            </h2>
        );
    }
}
 
export default employeeValues;