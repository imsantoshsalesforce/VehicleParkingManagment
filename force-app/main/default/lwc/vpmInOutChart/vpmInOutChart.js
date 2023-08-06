import { LightningElement, wire } from 'lwc';
import vehicleInOut from '@salesforce/apex/VehicleInfoController.getCountVehicleInOut';

export default class VpmInOutChart extends LightningElement {
    chartConfiguration;

    @wire(vehicleInOut)
    getCountInOut({ error, data }) {
        if (error) {
            this.error = error;
            this.chartConfiguration = undefined;
        } else if (data) {
            // let chartAmtData = [100, 50, 30];
            //    let chartRevData = [200, 100, 40];
            let inOutNumber = [];
            // let chartLabel = ['Two Wheeler', 'Three Wheeler', 'Four Wheeler'];
            let chartLabel = [];

            data.forEach(info => {
                inOutNumber.push(info.expr0);
                chartLabel.push(info.status__c);
                console.log("Yes Dash board recieves data :" + JSON.stringify(data));
            });

            this.chartConfiguration = {
                type: 'pie',
                data: {
                    datasets: [{
                        label: 'Amount',
                        // backgroundColor: ["green", "red", "blue"],
                        backgroundColor: ["#007ED6", "#7CDDDD"],
                        data: inOutNumber
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