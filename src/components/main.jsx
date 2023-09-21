import React, { Component } from 'react';
import EmployeeValues from './subcomponents/employeeValues.jsx';
import MachineValues from './subcomponents/machineValues.jsx';

class MachinePage extends Component {
    state = {
        curPath: 'C:\\Users\\John Campbell\\AppData\\Roaming\\IBM\\Client Access\\Emulator\\private',
        curPathServer: '\\\\192.168.0.13\\Engdrawing\\Inspection Logs\\Scanning Files',
        macroFile: '\\local files\\machine\\machine-data-macro.txt',
        machineFile: '\\local files\\machine\\machine.txt',
        machineGroupFile: '\\machines\\MachineGroups.txt',
        employeeFile: '\\local files\\employee\\employee.txt',
        employeeList: '\\employees\\EmployeeList.txt',
    }
    render() {
        return (
            <div>
                <EmployeeValues />
                <MachineValues />
            </div>
        );
    }
}
 
export default MachinePage;