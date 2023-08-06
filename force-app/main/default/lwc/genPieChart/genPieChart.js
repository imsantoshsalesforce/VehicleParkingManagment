import { LightningElement, api } from 'lwc';
import chartjs from '@salesforce/resourceUrl/chartHandler';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class GenPieChart extends LightningElement {
    @api chartConfig;

    isChartJsInitialized;
    renderedCallback() {
        if (this.isChartJsInitialized) {
            return;
        }
        // load chartjs from the static resource
        Promise.all([loadScript(this, chartjs)])
            .then(() => {
                this.isChartJsInitialized = true;
                const ctx = this.template.querySelector('canvas.pieChart').getContext('2d');
                this.chart = new window.Chart(ctx, JSON.parse(JSON.stringify(this.chartConfig)));
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading Chart',
                        message: error.message,
                        variant: 'error',
                    })
                );
            });
    }
}