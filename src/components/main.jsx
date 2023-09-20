import React, { Component } from 'react';
import EmployeeValues from './subcomponents/employeeValues.jsx';
import MachineValues from './subcomponents/machineValues.jsx';

class MachinePage extends Component {
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