import { ContextMenuMouseBasics } from './ContextMenuMouseBasics';
import { Component } from '../js_web_comp_lib/Component';

interface ContextMenuTreeEventResult {
    path: string,
    config: CT_Config,
    value: string | boolean
}

interface CT_Config {
    nodes: CT_Node[];
    leafs: CT_Leaf[];
}

interface CT_Node {
    name: string;
    nodes: CT_Node[];
    leafs: CT_Leaf[];
}


interface CT_Leaf {
    name: string;
}



// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CT_Button extends CT_Leaf {
}

// See https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
function isCT_Button(obj: CT_Leaf): obj is CT_Button {
    return !isCT_Value(obj);
}

interface CT_Value<T> extends CT_Leaf {
    value: T;
}
function isCT_Value(obj: CT_Leaf): obj is CT_Value<any> {
    return ((obj as CT_Value<any>).value !== undefined);
}



// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CT_Switch extends CT_Value<boolean> {

}

function isCT_Switch(obj: CT_Leaf): obj is CT_Switch {
    return isCT_Value(obj) && (typeof obj.value === 'boolean');
}

interface CT_Selection extends CT_Value<string> {
    valueCollection: string[];
}

function isCT_Selection(obj: CT_Leaf): obj is CT_Selection {
    return isCT_Value(obj) && (typeof obj.value === 'string') && ((obj as CT_Selection).valueCollection !== undefined);
}


class ContextMenuTree extends ContextMenuMouseBasics {
    config: CT_Config;




    menuElements: Set<string>;

    constructor() {
        super();


    }

    connectedCallback(): void {
        super.connectedCallback();


        // Register opening Menu in case clicking on Hamburger Icon
        const parent = this.parentNode;
        const elementId = this.getAttribute('elementid');
        const type = this.getAttribute('type');

        const targetElement = parent.querySelector('#' + elementId);

        targetElement.addEventListener(type, (ev) => {
            this.showMenu(ev as MouseEvent);
        });




    }

    registerCallBack(): void {

        // Register all collaps-Actions
        const nodes = this.shadowRoot.querySelectorAll(".node");
        nodes.forEach((node) => {
            node.addEventListener("click", (ev) => {
                const srcElement = ev.srcElement as Element;
                srcElement.parentElement.querySelector(".nested").classList.toggle("active");
                srcElement.classList.toggle("node-down");

                // Do not propagate Action, otherwise the Menu will be closed
                ev.stopPropagation();

            });
        });

        // Register all CT_Button
        const ctButtons = this.shadowRoot.querySelectorAll(".CT_Button");
        ctButtons.forEach((button) => {
            button.addEventListener("click", (ev) => {
                const srcElement = ev.srcElement as Element;
                const path = srcElement.getAttribute("path");
                this.dispatchEvent(new CustomEvent<ContextMenuTreeEventResult>('valueSelected', { detail: { path: path, config: this.config, value: undefined } }));
            })
        })

        // Register all CT_Switch
        const ctSwitch = this.shadowRoot.querySelectorAll(".CT_Switch");
        ctSwitch.forEach((button) => {
            button.addEventListener("click", (ev) => {
                const srcElement = ev.srcElement as Element;
                const path = srcElement.getAttribute("path");

                const leafElement = this.getLeafElement(path) as CT_Switch;
                if (leafElement !== undefined) {
                    if ((srcElement as HTMLInputElement).checked) {
                        leafElement.value = true;
                    } else {
                        leafElement.value = false;
                    }
                    this.dispatchEvent(new CustomEvent<ContextMenuTreeEventResult>('valueSelected', { detail: { path: path, config: this.config, value: leafElement.value } }));
                }


                // Do not propagate Action, otherwise the Menu will be closed
                ev.stopPropagation();
            })
        })

        // Register all CT_Selection
        const ctSelection = this.shadowRoot.querySelectorAll(".CT_Selection");
        ctSelection.forEach((button) => {
            button.addEventListener("click", (ev) => {
                const srcElement = ev.srcElement as Element;

                // Do not propagate Action, otherwise the Menu will be closed
                ev.stopPropagation();
            })

            button.addEventListener("change", (ev) => {
                const srcElement = ev.srcElement as Element;
                const path = srcElement.getAttribute("path");

                const leafElement = this.getLeafElement(path) as CT_Selection
                if (leafElement !== undefined) {
                    leafElement.value = (srcElement as HTMLInputElement).value;

                    this.dispatchEvent(new CustomEvent<ContextMenuTreeEventResult>('valueSelected', { detail: { path: path, config: this.config, value: leafElement.value } }));

                }
            })


        })



    }


    registerCustomEvents(identValue: any): void {
        //
    }

    getHTML(): string {

        let htmlString = "";
        const currentPath = "";
        htmlString = htmlString.concat(Component.html`<ul id="htmlTree" contenteditable="false">`);

        if (this.config !== undefined) {
            this.config.nodes.forEach((node) => {
                htmlString = htmlString.concat(this.getNodeString(node, currentPath));
            })

            this.config.leafs.forEach((leaf) => {
                htmlString = htmlString.concat(this.getLeafString(leaf, currentPath));
            })
        }

        htmlString = htmlString.concat(Component.html`</ul>`);




        const output = Component.html` 
        <style>
            .context-menu {
            display: none;
            position: fixed;
            z-index: 10;
            padding: 5px 0;
            /*width: 240px;*/
            background-color: #fff;
            border: solid 1px #dfdfdf;
            box-shadow: 10px 10px 5px grey;
            border-radius: 10px;
            opacity: 90%;
            
            }

            .context-menu--active {
            display: block;
            }
            
            /* Remove default bullets */
            ul, #myUL {
            list-style-type: none;
            }

            /* Remove margins and padding from the parent ul */
            #myUL {
            margin: 0;
            padding: 0;
            }

            /* Style the directory/arrow */
            .leaf,
            .node {
            cursor: pointer; 
            user-select: none; /* Prevent text selection */
            }

            .leafline {
                display: inline;
                font-family: sans-serif;
                width: 100%;
            }

            .node:hover,
            .leaf:hover{
                background-color: #DDDDDD;
            }

            .node:focus,
            .leaf:focus,
            .focused{
            border-color: black;
            background-color: #666699;
            }

           
            .node::before {
                content: "\\25B6";
                color: black;
                display: inline-block;
                margin-right: 6px;
            }
            .node-down::before {
                transform: rotate(90deg);  
            }            

            .over {
                border: 2px dashed #000;
            }

            .nested {
            display: none;
            }

            .active {
            display: block;
            }
          

        </style>

        <div id="context-menu" class="context-menu">
            ${htmlString}    
        </div>

        `;

        return output;
    }

    private getLeafElement(path: string): CT_Leaf {
        let element: CT_Leaf = undefined;
        const pathParts = path.split('/');
        if (pathParts.length > 1) {
            const leafName = pathParts.pop();
            const nodeNames = pathParts;

            let runningElement = this.config;

            for (const nodeName of nodeNames) {
                for (const nodeElement of runningElement.nodes) {
                    if (nodeElement.name === nodeName) {
                        runningElement = nodeElement;
                        break;
                    }
                }
            }

            for (const leafElement of runningElement.leafs) {
                if (leafElement.name === leafName) {
                    element = leafElement;
                    break;
                }
            }
        }



        return element;
    }

    private getLeafString(leaf: CT_Leaf, path: string): string {
        let htmlString = "";
        let leafString = "";
        const currentPath = path.concat('/' + leaf.name);

        if (isCT_Button(leaf)) {
            const ctButton = leaf as CT_Button;
            leafString = Component.html`<div class="CT_Button" path="${currentPath}">${ctButton.name}</div>`;
        } else if (isCT_Selection(leaf)) {
            const ctSelection = leaf as CT_Selection;
            let optionString = "";
            ctSelection.valueCollection.forEach((option) => {
                if (option === ctSelection.value) {
                    optionString = optionString.concat(Component.html`<option selected value="${option}">${option}</option>`);
                } else {
                    optionString = optionString.concat(Component.html`<option value="${option}">${option}</option>`);
                }
            })


            leafString = Component.html`<label for="${ctSelection.name}">${ctSelection.name}:</label>
<select class="CT_Selection" name="${ctSelection.name}" id="${ctSelection.name}" path="${currentPath}">
    ${optionString}
</select>`;


        } else if (isCT_Switch(leaf)) {
            const ctSwitch = leaf as CT_Switch;
            leafString = Component.html`<label for="${ctSwitch.name}">${ctSwitch.name}:</label>
<input type="checkbox" class="CT_Switch" id="${ctSwitch.name}" path="${currentPath}">`;
        } else {
            // Nothing to do
        }

        htmlString = htmlString.concat(Component.html`
                <li contenteditable="false">
                    <div class="leaf" contenteditable="false">
                
                        ${leafString}
                
                    </div>
                </li>`);

        return htmlString;
    }

    private getNodeString(node: CT_Node, path: string): string {
        let htmlString = "";
        const currentPath = path.concat('/' + node.name);

        htmlString = htmlString.concat(Component.html`<li contenteditable="false">
    <div class="node" draggable="true" contenteditable="false">
        ${node.name}
    </div>`);


        htmlString = htmlString.concat(Component.html`<ul class="nested">`);
        node.nodes.forEach((node) => {
            htmlString = htmlString.concat(this.getNodeString(node, currentPath));
        })

        node.leafs.forEach((leaf) => {
            htmlString = htmlString.concat(this.getLeafString(leaf, currentPath));
        })

        htmlString = htmlString.concat(Component.html`</ul>`);
        htmlString = htmlString.concat(Component.html`</li>`);
        return htmlString;
    }

    public setConfig(config: CT_Config): void {
        this.config = config;
        this.update();
    }





}
window.customElements.define('context-menu-tree', ContextMenuTree);

export { ContextMenuTree, ContextMenuTreeEventResult, CT_Config, CT_Node, CT_Leaf, CT_Button, CT_Selection, CT_Switch };

