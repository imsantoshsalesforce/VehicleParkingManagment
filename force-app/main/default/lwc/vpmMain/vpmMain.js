import { LightningElement, wire } from 'lwc';
import VpmChannel from '@salesforce/messageChannel/VpmChannel__c';
import { subscribe, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class VpmMain extends LightningElement {

    booleanVehicleEntry = false;
    booleanVehicleIn = false;
    booleanVehicleOut = false;
    booleanVehicleCategory = false;
    booleanViewReports = false;
    booleanTotalIncome = false;
    booleanDashBoard = false;

    publisherMessage = '';
    subscription = null;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.handleSubscribe();

        // Setting default selection of menu item as Dashboard
        this.showComponent('dashboard');
    }

    handleSubscribe() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.messageContext, VpmChannel, (message) => {
            console.log('Subscribed Value is :' + message.message);
            this.publisherMessage = message.message;
            //   this.ShowToast('Success', message.message, 'success', 'dismissable');
            this.showComponent(message.message);
        });
    }

    // ShowToast(title, message, variant, mode) {
    //     const evt = new ShowToastEvent({
    //         title: title,
    //         message: message,
    //         variant: variant,
    //         mode: mode
    //     });
    //     this.dispatchEvent(evt);
    // }



    // show component based on selection of Navigation Bar component

    // selected = null;
    // render(){
    //     return this.publisherMessage === 'Sign Up' ? signupTemplate:
    //     this.selected === 'Sign In'? signinTemplate:
    //     defaultTemplate
    // }

    // showComponent() {

    //     if (this.publisherMessage === "vehicleEntry") {

    //     }
    // }

    showComponent(componentName) {
        console.log('CAse : Message' + componentName);
        switch (componentName) {

            case 'dashboard':
                this.booleanVehicleEntry = false;
                this.booleanVehicleIn = false;
                this.booleanVehicleOut = false;
                this.booleanVehicleCategory = false;
                this.booleanViewReports = false;
                this.booleanTotalIncome = false;
                this.booleanDashBoard = true;
                break;

            case 'vehicleCategory':
                this.booleanVehicleEntry = false;
                this.booleanVehicleIn = false;
                this.booleanVehicleOut = false;
                this.booleanVehicleCategory = true;
                this.booleanViewReports = false;
                this.booleanTotalIncome = false;
                this.booleanDashBoard = false;
                break;

            case 'vehicleEntry':
                this.booleanVehicleEntry = true;
                this.booleanVehicleIn = false;
                this.booleanVehicleOut = false;
                this.booleanVehicleCategory = false;
                this.booleanViewReports = false;
                this.booleanTotalIncome = false;
                this.booleanDashBoard = false;
                break;

            case 'inVehicles':
                this.booleanVehicleEntry = false;
                this.booleanVehicleIn = true;
                this.booleanVehicleOut = false;
                this.booleanVehicleCategory = false;
                this.booleanViewReports = false;
                this.booleanTotalIncome = false;
                this.booleanDashBoard = false;
                break;

            case 'outVehicles':
                this.booleanVehicleEntry = false;
                this.booleanVehicleIn = false;
                this.booleanVehicleOut = true;
                this.booleanVehicleCategory = false;
                this.booleanViewReports = false;
                this.booleanTotalIncome = false;
                this.booleanDashBoard = false;
                break;

            case 'viewReports':
                this.booleanVehicleEntry = false;
                this.booleanVehicleIn = false;
                this.booleanVehicleOut = false;
                this.booleanVehicleCategory = false;
                this.booleanViewReports = true;
                this.booleanTotalIncome = false;
                this.booleanDashBoard = false;
                break;

            case 'totalIncome':
                this.booleanVehicleEntry = false;
                this.booleanVehicleIn = false;
                this.booleanVehicleOut = false;
                this.booleanVehicleCategory = false;
                this.booleanViewReports = false;
                this.booleanTotalIncome = true;
                this.booleanDashBoard = false;
                break;

            // default:
            // break;
        }
    }

}