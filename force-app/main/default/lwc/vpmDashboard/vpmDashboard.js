import { LightningElement, wire } from 'lwc';
import getVehicleInfoData from '@salesforce/apex/VehicleInfoController.getVehicleInfoAll';


export default class VpmDashboard extends LightningElement {

    totalVehicleParkedCount = 0;
    vehiclesInCount = 0;
    vehiclesOutCount = 0;
    todaysParkingCount = 0;
    todaysDate = Date.now();

    @wire(getVehicleInfoData)
    wiredVehicleInInfo({ data, error }) {
        if (data) {
            data.forEach(element => {
                if (element.status__c === 'In') {
                    this.vehiclesInCount++;
                }
                if (element.status__c === 'Out') {
                    this.vehiclesOutCount++;
                }
                this.totalVehicleParkedCount = this.vehiclesInCount + this.vehiclesOutCount;
                if (element.status__c === 'In' && this.isSameDay(new Date(this.todaysDate), new Date(parseInt(element.in_time__c)))) {
                    this.todaysParkingCount++;
                }
            });
        }
        if (error) {
            console.log('Error while accessing vehicle info in Dashboard :' + error);
        }
    }

    isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth();
    }
}