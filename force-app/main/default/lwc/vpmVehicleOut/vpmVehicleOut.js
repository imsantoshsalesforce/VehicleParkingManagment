import { LightningElement, wire, track } from 'lwc';
import getVehicleInfoData from '@salesforce/apex/VehicleInfoController.getVehicleInfo';

export default class VpmVehicleOut extends LightningElement {

    @wire(getVehicleInfoData, { status: 'Out' })
    vehicleInfo;

    parkingOutStatus = true;
    parkingOutDetailStatus = false;

    regNumberValue = "";
    vCompanyNameValue = "";
    vCategoryValue = "";
    custNameValue = "";
    custContactValue = "";
    currentStatusValue = "";
    parkingNumberValue = "";
    vehicleInTimeValue = "";
    vehicleInOutValue = "";
    totalChargesValue = "";
    statusValue = "";
    remarksValue = "";
    selectedId;

    viewDetails(event) {
        this.parkingOutStatus = false;
        this.parkingOutDetailStatus = true;

        console.log('SELECTED ID : ' + event.target.value);

        this.selectedId = event.target.value;
        // console.log('ID :: ' + event.target.value);

        // console.log('Vehicle Info data :' + JSON.stringify(this.vehicleInfo.data));

        this.recItem = this.vehicleInfo.data.filter(info => {
            return info.Id === this.selectedId;
        });

        this.loadDataToFields();
    }

    loadDataToFields() {
        console.log('Inside load data');
        console.log("filter result :" + JSON.stringify(this.recItem));

        this.regNumberValue = this.recItem[0].registration_number__c;
        this.vCompanyNameValue = this.recItem[0].vehicle_company_name__c;
        this.vCategoryValue = this.recItem[0].vehicle_category__c;
        this.custNameValue = this.recItem[0].owner_name__c;
        this.custContactValue = this.recItem[0].owner_contact_number__c;
        this.currentStatusValue = this.recItem[0].status__c === 'In' ? 'Vehicle In' : 'Vehicle Out';
        this.parkingNumberValue = this.recItem[0].parking_number__c;
        this.totalChargesValue = this.recItem[0].parking_charge__c;
        this.statusValue = this.recItem[0].status__c;
        this.remarksValue = this.recItem[0].remark__c;

        let formatInDate = new Date(parseInt(this.recItem[0].in_time__c));
        let formatLocalInDate = formatInDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        this.vehicleInTimeValue = formatLocalInDate.toString();

        let formatOutDate = new Date(parseInt(this.recItem[0].out_time__c));
        let formatLocalOutDate = formatOutDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        this.vehicleOutTimeValue = formatLocalOutDate.toString();



        // Future Implementation of handling Vehicle Out status
        this.vStatusArray = [{ value: this.recItem[0].Id, label: 'Outgoing Vehicle' }];
        // totalChargesValue = "";
        // statusValue = "";
        // remarksValue = "";        
    }







}