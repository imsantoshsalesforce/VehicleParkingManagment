import { LightningElement, api, wire } from 'lwc';
// import getAccounts from '@salesforce/apex/VehicleCategoryController.getAccount';
import getVehicleCategory from '@salesforce/apex/VehicleCategoryController.getVehicleCategory';
import insertCategory from '@salesforce/apex/VehicleCategoryController.insertVehicleCategory';
import deleteCategory from '@salesforce/apex/VehicleCategoryController.deleteVehicleCategory';
import updateCategory from '@salesforce/apex/VehicleCategoryController.updateVehicleCategory';
import { refreshApex } from '@salesforce/apex';

export default class VpmVehicleCategory extends LightningElement {

    // @wire(getAccounts) accounts;
    @wire(getVehicleCategory) vehicleCategories;


    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    isModalOpen = false;
    isDeleteModalOpen = false;
    isUpdateModalOpen = false;
    categoryNameValue = "";
    descriptionValue = "";
    recordIdForDeletion;
    recordIdForUpdation;

    showAddCategoryModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.isDeleteModalOpen = false;
        this.isUpdateModalOpen = false;
        // Reset input fields
        this.resetFields();
    }
    showDeleteCategoryModal(event) {
        this.isDeleteModalOpen = true;
        this.recordIdForDeletion = event.target.value;
        console.log('Record to be deleted   ::' + this.recordIdForDeletion);
    }

    showUpdateCategoryModal(event) {
        this.isUpdateModalOpen = true;
        this.recordIdForUpdation = event.target.value;

        for (let i = 0; i < this.vehicleCategories.data.length; i++) {
            if (this.recordIdForUpdation === this.vehicleCategories.data[i].Id) {
                // todoTaskIndex = i;
                console.log("Selected Data for ID :" + JSON.stringify(this.vehicleCategories.data[i].vehicle_category__c) + "  >>   " + JSON.stringify(this.vehicleCategories.data[i].short_description__c));
                this.categoryNameValue = this.vehicleCategories.data[i].vehicle_category__c;
                this.descriptionValue = this.vehicleCategories.data[i].short_description__c;
            }
        }
    }

    submitDetails(event) {
        if (this.validationHandler()) {
            //create a new category object based on input box values
            const category = { catName: this.categoryNameValue, description: this.descriptionValue };
            insertCategory({ payload: JSON.stringify(category) })
                .then(result => {
                    if (result) {
                        //fetch fresh list of todos
                        // this.fetchTodos();

                        console.log('Result after insert:' + result);
                    }
                    return refreshApex(this.vehicleCategories);
                })
                .catch(error => {
                    console.error("Error in adding Category" + error);
                });
            // Reset input fields
            this.resetFields();
            this.isModalOpen = false;
        }
    }

    deleteCategory() {
        deleteCategory({ recordId: this.recordIdForDeletion }).then(result => {
            console.log('Result after delete:' + result);
            this.isDeleteModalOpen = false;
            return refreshApex(this.vehicleCategories);
        }).catch(error => {
            console.error("Error in deleting Category" + error);
        });
    }

    updateCategory() {
        if (this.validationHandler()) {
            console.log(this.categoryNameValue);
            console.log(this.descriptionValue);

            updateCategory({
                recordId: this.recordIdForUpdation, catName: this.categoryNameValue,
                description: this.descriptionValue
            }).then(result => {
                console.log('Result after update:' + result);
                return refreshApex(this.vehicleCategories);
            }).catch(error => {
                console.error("Error in Update Category" + error);
            });

            this.isUpdateModalOpen = false;
            // Reset input fields
            this.resetFields();
        }
    }

    getOnChangeValue(event) {
        if (event.target.name == 'catName') {
            this.categoryNameValue = event.target.value;
        }
        if (event.target.name == 'description') {
            this.descriptionValue = event.target.value;
        }
    }

    // Reset Input field values
    resetFields() {
        this.categoryNameValue = "";
        this.descriptionValue = "";
    }

    validationHandler() {
        let statusModel = true;
        let catSelect = this.template.querySelector('.inputCatName');
        let descSelect = this.template.querySelector('.inputDescription');

        if (!catSelect.value) {
            // this.categoryNameValue = event.target.value;
            statusModel = false;
            catSelect.setCustomValidity("Category value is required");
        } else {
            catSelect.setCustomValidity("");
        }
        catSelect.reportValidity();

        if (!descSelect.value) {
            // this.categoryNameValue = event.target.value;
            statusModel = false;
            descSelect.setCustomValidity("Category Description is required");
        } else {
            descSelect.setCustomValidity("");
        }
        descSelect.reportValidity();
        return statusModel;
    }
}