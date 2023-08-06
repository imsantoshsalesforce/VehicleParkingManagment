import { LightningElement, wire, track } from 'lwc';
import getVehicleInfoData from '@salesforce/apex/VehicleInfoController.getVehicleInfo';
import updateVehicleStatus from '@salesforce/apex/VehicleInfoController.updateVehicleInfo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class VpmVehicleIn extends LightningElement {

    @wire(getVehicleInfoData, { status: 'In' })
    vehicleInfo;

    parkingInVehicleStatus = true;
    parkingOutStatus = false;

    regNumberValue = "";
    vCompanyNameValue = "";
    vCategoryValue = "";
    custNameValue = "";
    custContactValue = "";
    currentStatusValue = "";
    parkingNumberValue = "";
    vehicleInTimeValue = "";
    selectedId;

    totalChargesValue = "";
    statusValue = "";
    remarksValue = "";

    @track
    vStatusArray = [];
    recItem;

    updateParkingOutStatus(event) {
        this.parkingOutStatus = true;
        this.parkingInVehicleStatus = false;

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
        // this.vehicleInTimeValue = this.recItem[0].in_time__c;

        let formatDate = new Date(parseInt(this.recItem[0].in_time__c));
        let formatLocalDate = formatDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        this.vehicleInTimeValue = formatLocalDate.toString();

        // Future Implementation of handling Vehicle Out status
        this.vStatusArray = [{ value: this.recItem[0].Id, label: 'Outgoing Vehicle' }];
        // totalChargesValue = "";
        // statusValue = "";
        // remarksValue = "";        
    }

    get statusOptions() {
        return this.vStatusArray;
    }

    getOnChangeValue(event) {
        if (event.target.name == 'input-regNumber') {
            this.regNumberValue = event.target.value;
        }
        if (event.target.name == 'input-compName') {
            this.vCompanyNameValue = event.target.value;
        }
        if (event.target.name == 'input-vehicleCat') {
            this.vCategoryValue = event.target.value;
        }
        if (event.target.name == 'input-custName') {
            this.custNameValue = event.target.value;
        }
        if (event.target.name == 'input-custContact') {
            this.custContactValue = event.target.value;
        }

        if (event.target.name == 'input-totalCharges') {
            this.totalChargesValue = event.target.value;
        }
        if (event.target.name == 'input-status') {
            this.statusValue = event.target.value;
        }
        if (event.target.name == 'input-remarks') {
            this.remarksValue = event.target.value;
        }
    }

    submitOutGoingVehicle(event) {

        updateVehicleStatus({
            recordId: this.selectedId, totalCharges: this.totalChargesValue,
            remarks: this.remarksValue, outTime: Date.now()
        }).then(result => {
            console.log('Result after vehicle status update:' + result);
            // return refreshApex(this.vehicleCategories);
            if (result) {
                this.showSuccessToast();
                this.parkingInVehicleStatus = true;
                this.parkingOutStatus = false;
            }
        }).catch(error => {
            console.error("Error in vehicle status" + error);
        });

        //  this.showSuccessToast();
        // this.parkingInVehicleStatus = true;
        // this.parkingOutStatus = false;

        return refreshApex(this.VpmVehicleIn);
    }

    resetFields() {
        this.totalChargesValue = "";
        this.statusValue = "";
        this.remarksValue = "";
    }

    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Vehicle status updated successfully',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
}