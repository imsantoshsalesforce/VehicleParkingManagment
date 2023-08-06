import { LightningElement, wire } from 'lwc';
import getVehicleInfoData from '@salesforce/apex/VehicleInfoController.getVehicleInfo';


export default class VpmViewReports extends LightningElement {

    @wire(getVehicleInfoData, { status: 'In' })
    vehicleInfo;

    recItem;

    startDateValue = "";
    endDateValue = "";

    displayDateSelection = true;
    displayReport = false;

    getDate(event) {
        if (event.target.name == 'from-date') {
            this.startDateValue = event.target.value;
        }
        if (event.target.name == 'end-date') {
            this.endDateValue = event.target.value;
        }
    }

    generateReport(event) {

        this.displayDateSelection = false;
        this.displayReport = true;

        // console.log('startDateValue :' + this.startDateValue);
        // console.log('endDateValue :' + this.endDateValue);

        let InputStartDate = new Date(this.startDateValue).getTime();
        let InputEndDate = new Date(this.endDateValue).getTime();
        // console.log(start);

        // Revisit for issue fix while same date for start and end date
        this.recItem = this.vehicleInfo.data.filter(info => {
            return info.in_time__c <= InputEndDate && info.in_time__c >= InputStartDate;
            // return info.vehicle_category__c == 'Two wheeler';
        });

        // console.log("filter resultaaa:" + JSON.stringify(this.recItem));
    }
}