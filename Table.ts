//import { LitElement, html } from '@polymer/lit-element';
import { Component } from '../js_web_comp_lib/Component';
import { CSS } from '../Css';
import { ContextMenu, ContextEventResult, } from './ContextMenu';



interface TableEventResult {
    tableData: TableData,
    line: number,
    column: number
}

interface ColumnConfig {
    name: string,
    initValue: string,
    readOnly: boolean,
    visible?: boolean,
    fct(tableConfig: TableConfig, tableEventResult: TableEventResult): void,
    validator(cell: Cell): boolean,
    bkColor(tableConfig: TableConfig, tableEventResult: TableEventResult): string
}

interface TableConfig {
    columns: ColumnConfig[]
}

type Cell = string;
type Line = Cell[];
type TableData = Line[];





class Table extends Component {

    tableConfig: TableConfig;
    tableData: TableData;



    constructor() {

        super();

    }

    connectedCallback() {
        super.connectedCallback();

        console.log('Context Menu.');

    }

    unRegisterCallBack() {

    }

    registerCallBack() {

        // Connect context menu callbacks

        let headerContext = this.shadowRoot.getElementById("C_HEADING");
        if (null != headerContext) {
            headerContext.addEventListener('valueSelected', (e: CustomEvent) => {
                var details: ContextEventResult = e.detail;

                if (typeof this.tableData === 'undefined') {
                    this.tableData = [];
                }

                switch (details.command) {
                    case 'add':
                        var lineNumber = 0;
                        var line: Line = [];
                        this.tableConfig.columns.forEach((cellCfg) => {
                            line.push(cellCfg.initValue);
                        });
                        this.tableData.splice(lineNumber, 0, line);
                        this.update();
                        this.dispatchEvent(new CustomEvent<TableEventResult>('valueChanged', { detail: { tableData: this.tableData, line: lineCtr, column: columnCtr } }));

                        break;
                    case 'remove':
                        if (this.tableData.length > 1) {
                            var lineNumber = 0;
                            this.tableData.splice(lineNumber, 1);
                            this.update();
                            this.dispatchEvent(new CustomEvent<TableEventResult>('valueChanged', { detail: { tableData: this.tableData, line: lineCtr, column: columnCtr } }));

                        }
                        break;
                    default:
                }

            });
        }

        let headerButton = this.shadowRoot.getElementById("H_HEADING") as HTMLButtonElement;
        if (headerButton !== undefined && null != headerButton) {
            headerButton.addEventListener('click', (e: MouseEvent) => {

                this.dispatchEvent(new CustomEvent<TableEventResult>('tableSelected', { detail: { tableData: this.tableData, line: 0, column: 0 } }));
            });
        }

        if (typeof this.tableData !== 'undefined') {
            for (var lineCtr = 0; lineCtr < this.tableData.length; lineCtr++) {

                let button = this.shadowRoot.getElementById("H_" + lineCtr);
                let fixLineCtr = lineCtr;
                // Add Click event
                button.addEventListener('click', (e: MouseEvent) => {

                    this.dispatchEvent(new CustomEvent<TableEventResult>('lineSelected', { detail: { tableData: this.tableData, line: fixLineCtr, column: 0 } }));
                });

                let context = this.shadowRoot.getElementById("C_" + lineCtr);



                context.addEventListener('valueSelected', (e: CustomEvent) => {
                    var details: ContextEventResult = e.detail;

                    switch (details.command) {
                        case 'add':
                            var lineNumber = parseInt(details.ident);
                            var line: Line = [];
                            this.tableConfig.columns.forEach((cellCfg) => {
                                line.push(cellCfg.initValue);
                            });



                            this.tableData.splice(lineNumber, 0, line);
                            this.update();
                            this.dispatchEvent(new CustomEvent<TableEventResult>('valueChanged', { detail: { tableData: this.tableData, line: lineCtr, column: columnCtr } }));

                            break;
                        case 'remove':
                            if (this.tableData.length > 1) {
                                var lineNumber = parseInt(details.ident);
                                this.tableData.splice(lineNumber, 1);
                                this.update();
                                this.dispatchEvent(new CustomEvent<TableEventResult>('valueChanged', { detail: { tableData: this.tableData, line: lineCtr, column: columnCtr } }));

                            }
                            break;
                        default:
                    }

                });
            }



            for (var lineCtr = 0; lineCtr < this.tableData.length; lineCtr++) {
                var line = this.tableData[lineCtr];
                for (var columnCtr = 0; columnCtr < line.length; columnCtr++) {

                    var element = this.shadowRoot.getElementById(lineCtr + " " + columnCtr) as HTMLScriptElement
                    element.addEventListener('change', (ev) => {


                        const regex = /(\d+)\s(\d+)/;

                        var target = ev.target as HTMLInputElement;
                        var value = target.value as Cell;
                        var id = target.id;

                        var match = regex.exec(id);
                        var lineCtr = parseInt(match[1]);
                        var columnCtr = parseInt(match[2]);

                        var rowconfig = this.tableConfig.columns[columnCtr];

                        var validValue = true;
                        if (typeof rowconfig.validator !== 'undefined') {
                            validValue = rowconfig.validator(value);
                        }

                        if (validValue) {
                            this.tableData[lineCtr][columnCtr] = value;

                            this.updateLine(lineCtr);

                            this.dispatchEvent(new CustomEvent<TableEventResult>('valueChanged', { detail: { tableData: this.tableData, line: lineCtr, column: columnCtr } }));

                        } else {
                            target.value = this.tableData[lineCtr][columnCtr];

                        }

                    });

                }
            }
        }

    }


    updateLineValues(lineCtr: number) {
        for (var columnCtr = 0; columnCtr < this.tableConfig.columns.length; columnCtr++) {
            const rowConfig = this.tableConfig.columns[columnCtr];


            if (typeof rowConfig.fct !== 'undefined' && rowConfig.fct != null) {
                rowConfig.fct(this.tableConfig, {
                    tableData: this.tableData,
                    line: lineCtr,
                    column: columnCtr
                } as TableEventResult);
            }


        }
    }

    updateLine(lineCtr: number) {

        // Calculate all line values
        this.updateLineValues(lineCtr);

        // Update Widgets
        var line = this.tableData[lineCtr];
        for (var columnCtr = 0; columnCtr < line.length; columnCtr++) {
            const cell = line[columnCtr];


            const element = this.shadowRoot.getElementById(lineCtr + " " + columnCtr) as HTMLInputElement;
            element.value = cell;




        };

    }


    getHTML() {

        var table = "";
        var header = "";
        var rows = "";
        var contextMenu = "";
        const entriesObj = { "Add%20Line": "add", "Remove%20Line": "remove" };

        if (typeof this.tableConfig !== 'undefined') {

            // Build up header
            header = header.concat(Component.html`
            <th>
                <button id="H_HEADING">
                </button>
            </th>`);
            contextMenu = contextMenu.concat(Component.html`
                <context-menu id="C_HEADING" elementId="H_HEADING" menu-entries=${JSON.stringify(entriesObj)} type=contextmenu ident="${"" + 0}">
                </context-menu>
                `);

            this.tableConfig.columns.forEach(row => {
                header = header.concat(Component.html`<th>${row.name}</th>`);
            })




            //Build up body
            var lineCtr = 0;

            if (typeof this.tableData !== 'undefined') {
                for (var lineCtr = 0; lineCtr < this.tableData.length; lineCtr++) {

                    var line = this.tableData[lineCtr];

                    var row = Component.html`
                    <tr>
                        <td>
                            <button id="H_${"" + lineCtr}">
                            </button>
                        </td>
                                         `;

                    for (var cellCtr = 0; cellCtr < this.tableConfig.columns.length; cellCtr++) {
                        var cell = line[cellCtr];
                        var columnConfig = this.tableConfig.columns[cellCtr];
                        var readOnly = "";
                        var visible = "";


                        // Set cell background color if needed
                        const rowConfig = this.tableConfig.columns[cellCtr];
                        var backGroundColor = "";
                        if (typeof rowConfig.bkColor !== 'undefined' && rowConfig.bkColor != null) {
                            var color = rowConfig.bkColor(this.tableConfig,
                                {
                                    tableData: this.tableData,
                                    line: lineCtr,
                                    column: cellCtr
                                } as TableEventResult);

                            if (color != null) {
                                backGroundColor = Component.html`style="background-color:${color};"`;
                            }



                        }

                        if (columnConfig.readOnly) {
                            readOnly = 'readonly';
                        }


                        if (cell == null) {
                            cell = "";
                        }

                        if ((columnConfig.visible !== undefined) && !columnConfig.visible) {
                            visible = Component.html`style="width:0%"`;
                        }

                        row = row.concat(Component.html`
                        <td ${backGroundColor}><input ${backGroundColor} id="${lineCtr + " " + cellCtr}" type="text" value="${cell}"
                                ${readOnly} ${visible}></td>`);
                    };

                    row = row.concat(Component.html`</tr>`);
                    rows = rows.concat(Component.html`${row}`);
                }


                // Creating context menu


                for (var lineCtr = 0; lineCtr < this.tableData.length; lineCtr++) {
                    contextMenu = contextMenu.concat(Component.html`
                <context-menu id="C_${"" + lineCtr}" elementId="H_${"" + lineCtr}" menu-entries=${JSON.stringify(entriesObj)} type=contextmenu
                    ident="${"" + lineCtr}">
                </context-menu>
                `);
                }

            }


            table = table.concat(Component.html` 
                <tr>
                    ${header}
                </tr>
                ${rows}
                 `)

        }
        var html = Component.html` 
        

        <style>
           
            table{
            font-family: sans-serif;
            border-collapse: collapse;
            width: 100%;
            display: block;
            overflow: auto;
            table-layout: auto;
            
            }
            

             td,  th {
            border: 1px solid #ddd;
            padding: 8px;
            /*width: 20px;
            max-width: 80px; */
            white-space:normal;
            width:1%;
            
            }

             input {
                padding: 0px;
                border: 0px;
                background-color: rgba(0,0,0,0.0); // Sets to 0%% transparent
                display: block;
                width: 100%;
                height:100%;
                min-width: 1px;
                max-width: 500px;
                box-sizing: border-box;
                
            }

            tr:nth-child(even){
                background-color: #f2f2f2;
            }

             tr:hover {background-color: #ddd;}

             th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #4CAF50;
            color: white;
            
    
            }
        </style>
        
        <table id="customers">
        ${table}
        </table>
        
        ${contextMenu}

        `;

        return html;
    }

    config(config: TableConfig) {
        this.tableConfig = config;

    }

    setData(tableData: TableData) {
        this.tableData = tableData;

        // Recalculate all lines
        for (var lineCtr = 0; lineCtr < this.tableData.length; lineCtr++) {
            this.updateLineValues(lineCtr);
        }

        this.update();
    }

    static validateAgainstNumber(cell: Cell): boolean {
        return true;
    }




}
window.customElements.define('table-view', Table);

export { Table, TableConfig, ColumnConfig as RowConfig, TableData, Line, Cell, TableEventResult };

