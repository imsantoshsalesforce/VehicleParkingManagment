import { LightningElement, wire } from 'lwc';
import categoryRevenue from '@salesforce/apex/VehicleInfoController.getRevenueByCategory';

export default class VpmCategoryRevenueChart extends LightningElement {
    chartConfiguration;

    @wire(categoryRevenue)
    getCategoryWiseRevenue({ error, data }) {
        if (error) {
            this.error = error;
            this.chartConfiguration = undefined;
        } else if (data) {
            // let chartAmtData = [100, 50, 30];
            //    let chartRevData = [200, 100, 40];
            let revenueNumbers = [];
            // let chartLabel = ['Two Wheeler', 'Three Wheeler', 'Four Wheeler'];
            let chartLabel = [];

            data.forEach(info => {
                revenueNumbers.push(info.expr0);
                chartLabel.push(info.vehicle_category__c);
                console.log("Yes Dashboard recieves category revenue data :" + JSON.stringify(data));
            });

            this.chartConfiguration = {
                type: 'bar',
                data: {
                    datasets: [{
                        label: 'Revenue',
                        // backgroundColor: ["green"],
                        // backgroundColor: ["#007ED6", "#7CDDDD", "#52D726"],
                        backgroundColor: ["#47B39C", "#47B39C", "#47B39C"],
                        data: revenueNumbers
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