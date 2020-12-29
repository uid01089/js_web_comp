import { Component } from '../../js_web_comp_lib/Component';
import { ChartistCss } from './Chartist.css';
import { ReduxComponent } from '../../js_web_comp_lib/ReduxComponent';
import { State } from '../../ReduxStore';
import { AbstractReducer } from '../../js_web_comp_lib/AbstractReducer';
import { AbstractReduxStore } from '../../js_web_comp_lib/AbstractReduxStore';


const Chartist = require('chartist');

interface ChartData {
    series: number[],
    labels: string[]
}

abstract class PieChart extends ReduxComponent<State>  {
    chart1Data: ChartData;



    constructor(reducer: AbstractReducer<State>, reduxStore: AbstractReduxStore<State>) {
        super(reducer, reduxStore);

        this.chart1Data = {
            series: [20, 10, 30, 40],
            labels: ["", "", "", ""]
        };

    }

    public setChartData(chartData: ChartData): void {
        this.chart1Data = chartData;
    }

    connectedCallback(): void {
        super.connectedCallback();

        console.log("PieChart");

    }

    registerCallBack(): void {
        const chartElement = this.shadowRoot.getElementById("chart1");


        const chart = new Chartist.Pie(chartElement,
            this.chart1Data, {
            donut: true,
            donutWidth: 60,
            donutSolid: true,
            startAngle: 270,
            showLabel: true
        });
        chart.update();
    }



    getHTML(): string {


        return Component.html` 
        <style>

        </style>

        <!--link rel="stylesheet" href="../../node_modules/chartist/dist/chartist.css"-->
        ${ChartistCss}
        

        <div id="chart1"></div>

        
        `;
    }

}

export { PieChart, ChartData }



