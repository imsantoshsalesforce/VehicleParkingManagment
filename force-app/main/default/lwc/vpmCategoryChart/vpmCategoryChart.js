import { LightningElement, wire } from 'lwc';
import getCountVehicleCategory from '@salesforce/apex/VehicleInfoController.getCountVehicleCategory';

export default class VpmCategoryChart extends LightningElement {
    chartConfiguration;

    @wire(getCountVehicleCategory)
    getVehicleCatCount({ error, data }) {
        if (error) {
            this.error = error;
            this.chartConfiguration = undefined;
        } else if (data) {
            // let chartAmtData = [100, 50, 30];
            //    let chartRevData = [200, 100, 40];
            let chartAmtData = [];
            // let chartLabel = ['Two Wheeler', 'Three Wheeler', 'Four Wheeler'];
            let chartLabel = [];

            data.forEach(cat => {
                chartAmtData.push(cat.expr0);
                // chartRevData.push(opp.expectRevenue);
                chartLabel.push(cat.vehicle_category__c);
                console.log("Yes Dash board recieves data :" + JSON.stringify(data));
            });

            this.chartConfiguration = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        label: 'Amount',
                        // backgroundColor: ["green", "red", "blue"],
                        backgroundColor: ["#52D726", "#FF7300", "#FFEC00"],
                        data: chartAmtData
                    },
                        // {
                        //     label: 'Expected Revenue',
                        //     backgroundColor: "orange",
                        //     data: chartRevData,
                        // },
                    ],
                    labels: chartLabel,
                },
                options: {},
            };
            console.log('data => ', data);
            this.error = undefined;
        }
    }
}