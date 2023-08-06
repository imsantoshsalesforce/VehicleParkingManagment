import { LightningElement, wire, track } from 'lwc';
import getVehicleInfoData from '@salesforce/apex/VehicleInfoController.getVehicleInfo';

export default class VpmTotalIncome extends LightningElement {

    // @wire(getVehicleInfoData, { status: 'Out' })
    @track
    vehicleInfo;
    recItems;

    totalIncome = 0;
    todaysIncome = 0;
    yesterdaysIncome = 0;
    todaysDate = Date.now();
    yesterdayDate = new Date(Date.now() - 864e5);   // 864e5 means 24*60*60*1000

    @wire(getVehicleInfoData, { status: 'Out' })
    wiredVehicleInfo({ error, data }) {
        if (data) {
            this.vehicleInfo = data;
            // this.recItems = this.vehicleInfo.data.filter(info => {
            //     // return info.in_time__c <= end && info.in_time__c >= start;
            //     // return info.vehicle_category__c == 'Two wheeler';
            //     
            // });
            data.forEach(element => {
                this.totalIncome = this.totalIncome + element.parking_charge__c;
            });

            // let todaysEarning = this.vehicleInfo.filter(info => {
            //     return
            // });

            data.forEach(element => {
                // console.log(new Date(parseInt(element.out_time__c)));
                if (this.isSameDay(new Date(this.todaysDate), new Date(parseInt(element.out_time__c)))) {
                    this.todaysIncome = this.todaysIncome + element.parking_charge__c;
                }

                if (this.isSameDay(this.yesterdayDate, new Date(parseInt(element.out_time__c)))) {
                    this.yesterdaysIncome = this.todaysIncome + element.parking_charge__c;
                }
            });

        } else if (error) {
            console.log('Error while accessing vehicle Info :' + error);
        }
    }

    isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth();
    }

    // recItem = this.vehicleInfo.data.filter(info => {
    //     return info.in_time__c <= end && info.in_time__c >= start;
    //     // return info.vehicle_category__c == 'Two wheeler';
    // });




}