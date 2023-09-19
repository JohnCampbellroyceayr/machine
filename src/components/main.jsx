import React, { Component } from 'react';
import Menu from './subcomponents/menu.jsx';
import EmployeeValues from './subcomponents/employeeValues.jsx';
import MachineValues from './subcomponents/machineValues.jsx';
import MachineActions from './subcomponents/machineActions.jsx';

class MachinePage extends Component {
    render() {
        return (
            <div>
                <EmployeeValues />
                <MachineValues />
                <MachineActions />
            </div>
        );
    }
}
 
export default MachinePage;