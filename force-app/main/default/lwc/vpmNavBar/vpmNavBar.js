import { LightningElement, wire } from 'lwc';
import VpmChannel from '@salesforce/messageChannel/VpmChannel__c';
import { publish, MessageContext } from 'lightning/messageService'

export default class VpmNavBar extends LightningElement {

    @wire(MessageContext)
    messageContext;
    message;

    handleSelect(event) {
        console.log('You hit :' + event.detail.name);
        // this.message = event.target.name;
        let message = { message: event.detail.name };
        console.log('Yes You hit :' + message);
        publish(this.messageContext, VpmChannel, message);
    }

}