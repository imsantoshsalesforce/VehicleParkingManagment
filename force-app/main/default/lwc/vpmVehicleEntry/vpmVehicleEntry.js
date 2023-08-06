import { LightningElement, wire, track } from 'lwc';
import insertVehicle from '@salesforce/apex/VehicleInfoController.insertVehicleInfo';
import getCategoryList from '@salesforce/apex/VehicleCategoryController.getVehicleCategory';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class VpmVehicleEntry extends LightningElement {

    regNumberValue = "";
    vCompanyNameValue = "";
    vCategoryValue = "";
    custNameValue = "";
    custContactValue = "";
    parkNum = "";

    @track
    vCatArray = [];
    receivedData;

    // get vehicle category list    
    @wire(getCategoryList)
    wiredCategory({ error, data }) {
        if (data) {
            this.receivedData = data;
            (data).forEach(cat => {
                this.vCatArray = [...this.vCatArray, { value: cat.Id, label: cat.vehicle_category__c }];
            });
        } else if (error) {
            console.log('Gotch error while fetching categories :' + error);
        }
    }

    get categoryOptions() {
        return this.vCatArray;
    }

    handleChange(event) {
        const selectedIdValue = event.target.value;

        // validation
        this.template.querySelector('.category').setCustomValidity("");
        this.template.querySelector('.category').reportValidity();

        // get index of selected item from drop down
        let selectedIndexOfCatArray = this.receivedData.findIndex(cat => cat.Id === selectedIdValue);
        // passing index to array to get the value
        this.vCategoryValue = this.receivedData[selectedIndexOfCatArray].vehicle_category__c;
        // console.log('Selected value from drop down :' + this.vCategoryValue);
    }


    submitVehicleInfo() {

        if (this.validationHandler()) {

            // Future Implementation :  Separate UI to be created for parking slot selection
            this.parkNum = Math.floor(Math.random() * 9000 + 1000).toString();

            // Future Implementation : date time handling for Vehicle IN and OUT
            let dateInMiliSeconds = Date.now();

            // convert millisec to date format  
            // var dateFormat = new Date(dateInMiliSeconds);
            // let result = dateFormat.toString();

            // var date = new Date("04/02/2023 09:23:00"); // some mock date
            // var dateInMiliSeconds = date.getTime();

            //create a new vehicle info object based on input box values
            const vehicleInfoObj = {
                regNumber: this.regNumberValue,
                compName: this.vCompanyNameValue,
                catName: this.vCategoryValue,
                custName: this.custNameValue,
                custContact: this.custContactValue,
                parkNumber: this.parkNum,
                inTime: dateInMiliSeconds
            };

            // console.log('Data Object before sending  :' + JSON.stringify(vehicleInfoObj));

            insertVehicle({ payload: JSON.stringify(vehicleInfoObj) })
                .then(result => {
                    console.log("After insert :" + result);
                    // Reset input fields
                    this.resetFields();
                    this.showSuccessToast();
                })
                .catch(error => {
                    console.error("Error in adding Vehicle Info" + error);
                });
        }
    }

    cancelVehicleInfo(event) {
        this.resetFields();
    }

    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Vehicle Information submitted sucessfully',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    getOnChangeValue(event) {

        this.validationHandler();

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
    }

    resetFields() {
        this.regNumberValue = "";
        this.vCompanyNameValue = "";
        this.template.querySelector('.category').value = undefined;
        this.custNameValue = "";
        this.custContactValue = "";
    }

    validationHandler() {

        let regNumberRef = this.template.querySelector('.regNumber');
        let compNameRef = this.template.querySelector('.compName');
        let categoryRef = this.template.querySelector('.category');
        let custNameRef = this.template.querySelector('.custName');
        let custContactRef = this.template.querySelector('.custContact');

        let statusModel = true;

        if (!regNumberRef.value) {
            // this.categoryNameValue = event.target.value;
            statusModel = false;
            regNumberRef.setCustomValidity("Register Number value is required");
        } else {
            regNumberRef.setCustomValidity("");
        }
        regNumberRef.reportValidity();

        if (!compNameRef.value) {
            // this.categoryNameValue = event.target.value;
            statusModel = false;
            compNameRef.setCustomValidity("Company Name is required");
        } else {
            compNameRef.setCustomValidity("");
        }
        compNameRef.reportValidity();

        if (!custNameRef.value) {
            // this.categoryNameValue = event.target.value;
            statusModel = false;
            custNameRef.setCustomValidity("Customer Name is required");
        } else {
            custNameRef.setCustomValidity("");
        }
        custNameRef.reportValidity();

        if (!categoryRef.value) {
            // this.categoryNameValue = event.target.value;
            statusModel = false;
            categoryRef.setCustomValidity("Category is required");
        } else {
            categoryRef.setCustomValidity("");
        }
        categoryRef.reportValidity();

        if (!custContactRef.value) {
            // this.categoryNameValue = event.target.value;
            statusModel = false;
            custContactRef.setCustomValidity("Contact is required");
        } else {
            custContactRef.setCustomValidity("");
        }
        custContactRef.reportValidity();
        return statusModel;
    }
}
