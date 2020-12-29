import { Component } from '../../js_web_comp_lib/Component';
import { ChartistCss } from './Chartist.css';
import { ReduxComponent } from '../../js_web_comp_lib/ReduxComponent';
import { State } from '../../ReduxStore';
import { AbstractReducer } from '../../js_web_comp_lib/AbstractReducer';
import { AbstractReduxStore } from '../../js_web_comp_lib/AbstractReduxStore';


const Chartist = require('chartist');

interface StackBarChartData {
    series: number[][],
    labels: string[]
}

abstract class StackBarChart extends ReduxComponent<State>  {
    chart1Data: StackBarChartData;



    constructor(reducer: AbstractReducer<State>, reduxStore: AbstractReduxStore<State>) {
        super(reducer, reduxStore);

        this.chart1Data = {
            series: [
                [800000, 1200000, 1400000, 1300000],
                [200000, 400000, 500000, 300000],
                [100000, 200000, 400000, 600000]
            ],
            labels: ['Q1', 'Q2', 'Q3', 'Q4']
        };

    }

    public setChartData(chartData: StackBarChartData): void {
        this.chart1Data = chartData;
    }

    connectedCallback(): void {
        super.connectedCallback();

        console.log("PieChart");

    }

    registerCallBack(): void {
        const chartElement = this.shadowRoot.getElementById("chart1");


        const chart = new Chartist.Bar(chartElement,
            this.chart1Data, {
            height: '300px',
            stackBars: true
        });
        chart.update();
    }



    getHTML(): string {


        return Component.html` 
        <style>
            .ct-series-a .ct-bar {
            stroke: blue !important;
            stroke-width: 20px;
            }
            .ct-series-b .ct-bar {
            stroke: red !important;
            stroke-width: 20px;
            }
            .ct-series-c .ct-bar {
            stroke: yellow !important;
            stroke-width: 20px;
            }

        </style>

        <!--link rel="stylesheet" href="../../node_modules/chartist/dist/chartist.css"-->
        ${ChartistCss}
        

        <div id="chart1"></div>

        
        `;
    }

}

export { StackBarChart, StackBarChartData }



