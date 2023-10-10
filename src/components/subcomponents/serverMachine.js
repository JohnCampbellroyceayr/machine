import file from "../../lib/file";
import obj from "../../lib/textFileObj";
import filePath from "../../lib/fileLocations";

class serverFiles {
    static getCurrentEmployee() {
        const employee = obj.makeStrIntoObject(file.read(filePath("employeeLocal")));
        if (this.usableValue(employee["Number"])) {
            const serverEmployeePath = filePath("employeesCurrent") + employee["Number"] + ".txt";
            if (file.exists(serverEmployeePath)) {
                const serverEmployee = obj.get(serverEmployeePath);
                return serverEmployee;
            }
        }
        const emptyEmployee = {
            "Number": "undefined",
            "Name": "undefined",
            "Status": "undefined",
            "LastChanged": "undefined"
        };
        file.createFile(filePath("employeeLocal"), obj.makeObjectIntoString(emptyEmployee));
        return emptyEmployee;
    }
    static getCurrentMachine() {
        const employee = obj.makeStrIntoObject(file.read(filePath("employeeLocal")));
        if (this.usableValue(employee["Number"])) {
            const serverEmployeePath = filePath("employeesCurrent") + employee["Number"] + ".txt";
            if (file.exists(serverEmployeePath)) {
                const serverEmployee = obj.get(serverEmployeePath);
                const machine = serverEmployee["CurrentMachine"];
                if (this.usableValue(machine)) {
                    const filePathMachine = filePath("machineServerDir") + machine + ".txt" ;
                    if (file.exists(filePathMachine)) {
                        return obj.get(filePathMachine);
                    }
                }
            }
            return "undefined";
        }
        return false;
    }
    static usableValue(value) {
        if (value != undefined && value != "undefined" && value != "" && value != null && value != "null") {
            return true;
        }
        return false;
    }
    static createNew(machineObj) {
        const name = machineObj["Machine"];
        const nameArray = file.getFileNames(filePath("machineServerDir"));
        if (this.machineDoesNotExist(name, nameArray)) {
            file.createFile(filePath("machineServerDir") + name + ".txt", obj.makeObjectIntoString(machineObj));
            return machineObj;
        }
        else {
            return false;
        }
    }
    static getExisting(name) {
        const filePathMachine = filePath("machineServerDir") + name + ".txt";
        if (file.exists(filePathMachine)) {
            const machine = obj.get(filePathMachine);
            return machine;
        }
        return false;
    }
    static machineDoesNotExist(machine, currentMachineArray) {
        for (let i = 0; i < currentMachineArray.length; i++) {
            const name = currentMachineArray[i].split(".")[0];
            if (name == machine) {
                return false;
            }                        
        }
        return true;
    }
    static changeEmployeeMachine(employeeNumber, machine) {
        const employeeFilePath = filePath("employeesCurrent") + employeeNumber + ".txt";
        if (file.exists(employeeFilePath)) {
            const currentEmployee = obj.get(employeeFilePath);
            currentEmployee["CurrentMachine"] = machine;
            file.createFile(employeeFilePath, obj.makeObjectIntoString(currentEmployee));            
        }
    }
    static saveMachine(machineObj) {
        const text = obj.makeObjectIntoString(machineObj);
        const machine = machineObj["Machine"];
        if (this.usableValue(machine)) {
            const filePathMachine = filePath("machineServerDir") + machine + ".txt";
            if (file.exists(filePathMachine)) {
                file.createFile(filePathMachine, text);
            }
        }
    }
    static deleteMachine(machineName) {
        console.log(machineName);
        if (this.usableValue(machineName)) {
            const filePathMachine = filePath("machineServerDir") + machineName + ".txt";
            console.log(filePathMachine);
            if (file.exists(filePathMachine)) {
                file.delete(filePathMachine);
            }
        }
    }
}
 
export default serverFiles;