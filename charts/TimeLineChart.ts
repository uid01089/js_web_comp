import { Component } from '../../js_web_comp_lib/Component';
import { ChartistCss } from './Chartist.css';
import { ReduxComponent } from '../../js_web_comp_lib/ReduxComponent';
import { State } from '../../ReduxStore';
import { AbstractReducer } from '../../js_web_comp_lib/AbstractReducer';
import { AbstractReduxStore } from '../../js_web_comp_lib/AbstractReduxStore';



const Chartist = require('chartist');
const moment = require('moment');
require('chartist-plugin-legend');

interface DataElement {
    x: Date,
    y: number
}


interface Serie {
    name: string,
    data: DataElement[]
}

interface ChartDataTimeLine {
    series: Serie[]
}

abstract class TimeLineChart extends ReduxComponent<State>  {
    chart1Data: ChartDataTimeLine;



    constructor(reducer: AbstractReducer<State>, reduxStore: AbstractReduxStore<State>) {
        super(reducer, reduxStore);

        this.chart1Data = {
            series: [{ name: "", data: [{ x: new Date(), y: 0 }] }]
        };

    }

    public setChartData(chartData: ChartDataTimeLine): void {
        this.chart1Data = chartData;
    }

    connectedCallback(): void {
        super.connectedCallback();

        console.log("PieChart");

    }

    registerCallBack(): void {
        const chartElement = this.shadowRoot.getElementById("chart1");


        const chart = new Chartist.Line(chartElement,
            this.chart1Data
            , {
                height: '300px',
                showPoint: false,
                axisX: {
                    type: Chartist.FixedScaleAxis,
                    divisor: 5,
                    labelInterpolationFnc: (value) => {
                        return moment(value).format('MMM YYYY');
                    }
                },
                plugins: [
                    Chartist.plugins.legend()
                ]
            });
        chart.update();
    }



    getHTML(): string {


        return Component.html` 
        
        
        <!--link rel="stylesheet" href="../../node_modules/chartist/dist/chartist.css"-->
        ${ChartistCss}
        
        <style>
            .ct-chart {
                position: relative;
            }
            .ct-legend {
                position: relative;
                z-index: 10;
                list-style: none;
                text-align: center;
            }
            .ct-legend li {
                position: relative;
                padding-left: 23px;
                margin-right: 10px;
                margin-bottom: 3px;
                cursor: pointer;
                display: inline-block;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 15px;
            }
            .ct-legend li:before {
                width: 12px;
                height: 12px;
                position: absolute;
                left: 0;
                content: '';
                border: 3px solid transparent;
                border-radius: 2px;
            }
            .ct-legend li.inactive:before {
                background: transparent;
            }
            .ct-legend.ct-legend-inside {
                position: absolute;
                top: 0;
                right: 0;
            }
            .ct-legend.ct-legend-inside li{
                display: block;
                margin: 0;
            }
            .ct-legend .ct-series-0:before {
                background-color: #d70206;
                border-color: #d70206;
            }
            .ct-legend .ct-series-1:before {
                background-color: #f05b4f;
                border-color: #f05b4f;
            }
            .ct-legend .ct-series-2:before {
                background-color: #f4c63d;
                border-color: #f4c63d;
            }
            .ct-legend .ct-series-3:before {
                background-color: #d17905;
                border-color: #d17905;
            }
            .ct-legend .ct-series-4:before {
                background-color: #453d3f;
                border-color: #453d3f;
            }
            .ct-legend .ct-series-5:before {
                background-color: #59922b;
                border-color: #59922b;
            }
            .ct-legend .ct-series-6:before {
                background-color: #0544d3;
                border-color: #0544d3;
            }
            .ct-legend .ct-series-7:before {
                background-color: #6b0392;
                border-color: #6b0392;
            }
            .ct-legend .ct-series-8:before {
                background-color: #f05b4f;
                border-color: #f05b4f;
            }
             .ct-legend .ct-series-9:before {
                background-color: #dda458;
                border-color: #dda458;
            }
            .ct-legend .ct-series-10:before {
                background-color: #eacf7d;
                border-color: #eacf7d;
            }
            .ct-legend .ct-series-11:before {
                background-color: #86797d;
                border-color: #86797d;
            }           
            .ct-legend .ct-series-12:before {
                background-color: #b2c326;
                border-color: #b2c326;
            }           
 /*
            .ct-chart-line-multipleseries .ct-legend .ct-series-0:before {
                background-color: #d70206;
                border-color: #d70206;
            }
            
            .ct-chart-line-multipleseries .ct-legend .ct-series-1:before {
                background-color: #0544d3;
                border-color: #0544d3;
            }
            
            .ct-chart-line-multipleseries .ct-legend li.inactive:before {
                background: transparent;
            }
            */
        </style>
            <div id="chart1"></div>
        `;
    }

}

export { TimeLineChart, ChartDataTimeLine, DataElement, Serie }



