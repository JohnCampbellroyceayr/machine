import React, { Component } from 'react';
import Menu from '../valuesMenu.jsx';
import file from '../../../lib/file.js';
import filePath from '../../../lib/fileLocations.js';

import StatMenu from '../statusMenu.jsx';

class Setup extends Component {
    state = {
        menus: [
            {id: 0, text: null, class: 'default', hidden: true, ref: React.createRef(), ref2: React.createRef()},
            {id: 1, text: null, class: 'default-big', hidden: true},
        ],
        buttons: [
            {id: 0, class: 'action', text: "Setup"},
            {id: 1, class: 'none', text: "Yes"},
        ],
        setupMenus: [
        ],
        setupButtons: [
        ],
        newOrderMessage: '',
        newOrders: [],
        interval: null,
    }
    componentDidMount() {
        this.updateMenus();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.status != this.props.status) {
            this.updateMenus();
        }
    }
    updateMenus = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].text = this.renderOrderMenu(0);
            menus[1].text = this.waitForVbscriptMenu(1);
            const buttons = [...prevState.buttons];
            buttons[0].disabled = (this.props.status == "Idle" || this.props.status == "Working") ? false : true;
            return { menus: menus, buttons: buttons};
        });
    }
    waitForVbscriptMenu = (index) => {
        return (
            <div>
                Please Wait while validating the order...
            </div>
        ); 
    }
    processVbScriptOrder = (values) => {
        if (values[1] == "false" || values[1] == undefined) {
            console.log(this.state.newOrders);
            this.setState(prevState => {
                const orders = [...prevState.newOrders];
                const deleteOrder = orders[orders.length - 1];
                const message = "Failed to find seq " + deleteOrder.seq + " on order " + deleteOrder.job;
                orders.splice(orders.length - 1, 1);
                return { newOrders: orders, newOrderMessage: message };
            });
        }
        else if(values[1] == "N" || values[1] == "Y") {
            const order = this.state.newOrders[this.state.newOrders.length - 1];
            order.report = values[1];
            if (values.length > 2) {
                order.part = values[2];
                order.goodPieces = values[4];
                order.piecesNeeded = values[3];
            }
            const message = "Succesfully added seq " + order.seq + " on order " + order.job;
            this.setState(prevState => {
                const orders = [...prevState.newOrders];
                orders[prevState.length - 1] = order;
                return { newOrders: orders, newOrderMessage: message };
            });

        }
        const menus = [...this.state.menus];
        menus[1].hidden = true;
        this.setState({ menus: menus }, () => {
            this.state.menus[0].ref.current.focus();
            this.updateMenus();
        });
    }
    showrenderOrderMenu = (bool, index) => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[index].hidden = false;
            return { menus: menus, oneOrder: bool, jobs: [], seq: [],};
        }, () => {
            this.state.menus[index].ref.current.focus();
        });
    }
    renderOrderMenu = (index) => {
        const inputOrder = (<input type='text' placeholder='order' onKeyDown={(e) => this.setupKeyPress(e, "order")} ref={this.state.menus[index].ref}></input>);
        const inputSeq = (<input type='text' placeholder='seq' onKeyDown={(e) => this.setupKeyPress(e, "seq")} ref={this.state.menus[index].ref2}></input>);
        const orders = this.state.newOrders.map((order, i) => {
            return (
                <>
                    <div className='mini-cell-menus'>{order.job}</div>
                    <div className='mini-cell-menus'>{order.seq}</div>
                    <br></br>
                </>
            );
        });
        const orderHeader = (
            <>
                <div>Work Orders to setup:</div>
                <div className='mini-cell-menus'>Order</div>
                <div className='mini-cell-menus'>Seq</div>
                <br></br>
            </>
        );
        const message = (
            <div>
                To setup these work orders press setup<br></br>
                <button onClick={() => this.props.setup(this.state.newOrders)}>Setup</button>
            </div>
        );
        const orderTable = (this.state.newOrders.length > 0) ? (<> {orderHeader} {orders} {message} </>) : '';
        const html = (
            <div>
                {this.state.newOrderMessage}<br></br>
                {orderTable}
                Enter work order number:<br></br>
                {inputOrder}<br></br>
                Enter work order sequence:<br></br>
                {inputSeq}
            </div>
        );
        return html;
    }

    setupKeyPress = (e, type) => {
        if (e.keyCode === 13) {
            if (e.target.value.trim() || type == "seq") {
                this.enterJob(e.target.value, type);
            }
            // else if(this.state.jobs.length > 0 && this.state.oneOrder != true && type == "order") {
            //     this.enterJob(e.target.value, type);
            // }
            // else {
            //     alert("Please fill out both the seq and the order")
            // }
        }
    }
    enterJob = (value, type) => {
        if (type == "order") {
            if(value != "") {
                this.state.menus[0].ref2.current.focus();
            }
        }
        else {
            const seq = (this.state.menus[0].ref2.current.value == "") ? 'null' : this.state.menus[0].ref2.current.value;
            const order = {
                job: this.state.menus[0].ref.current.value,
                seq: seq,
                report: null,
                part: null,
                goodPieces: null,
                piecesNeeded: null,
            }
            this.setState(prevState => {
                const orders = [...prevState.newOrders]
                orders.push(order);
                console.log(orders);
                return { newOrders: orders };
            }, () => { 
                console.log(this.state.newOrders[0]);
                this.state.menus[0].ref.current.value = "";
                this.state.menus[0].ref2.current.value = "";
                this.state.menus[0].ref.current.focus();
                this.checkWorkOrder(order);
            });
        }
    }
    setup = () => {
        this.setState(prevState => {
            const menus = [...prevState.menus];
            menus[0].hidden = true;
            menus[1].hidden = true;
            return { menus: menus };
        });
    }

    checkWorkOrder(order) {
        let text = "Macro" + '\t' + "CheckWorkOrder" + '\n';
        text += "Order" + '\t' + order.job + '\n';
        text += "Seq" + '\t' + order.seq + '\n';
        file.createFile(filePath("machineMacro"), text);
        file.createFile(filePath("machineGo"), "Not Empty");
        const menus = [...this.state.menus];
        menus[1].hidden = false;
        this.setState({ interval: setInterval(this.updateCheckWorkOrder, 1000), menus: menus });
    }

    updateCheckWorkOrder = () => {
        const fileText = file.read(filePath("machineGo"));
        const splitText = fileText.split("|");
        if (splitText[0] == "checkOrder") {
            clearInterval(this.state.interval);
            this.setState({
                interval: null,
            }, () => {
                this.processVbScriptOrder(splitText);
            })
        }
    }


    render() { 
        return (
            <>
                <Menu 
                    menus={[this.state.menus[0]]}
                    buttons={[this.state.buttons[0]]}
                />
                <StatMenu 
                    menu={this.state.menus[1]}
                    button={this.state.buttons[1]}
                />
            </>
        );
    }
}
 
export default Setup;