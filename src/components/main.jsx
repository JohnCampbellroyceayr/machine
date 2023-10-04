import React, { Component } from 'react';
import EmployeeValues from './subcomponents/employeeValues.jsx';
import MachineValues from './subcomponents/machineValues.jsx';

class MachinePage extends Component {
    render() {
        return (
            <div>
                <h2>
                    <EmployeeValues />
                    <MachineValues />
                </h2>
            </div>
        );
    }
}
 
export default MachinePage;