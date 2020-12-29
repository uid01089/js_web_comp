//import { LitElement, html } from '@polymer/lit-element';
import { ContextMenuMouseBasics } from './ContextMenuMouseBasics';
import { Component } from '../js_web_comp_lib/Component';

interface ContextEventResult {
    ident: any,
    command: string
}

class ContextMenuProgrammatical extends ContextMenuMouseBasics {



    menuElements: Set<string>;

    constructor() {
        super();


    }

    connectedCallback(): void {
        super.connectedCallback();

    }





    registerCustomEvents(identValue: any): void {
        this.menuElements.forEach((menuElementId) => {
            const element = this.shadowRoot.getElementById(menuElementId);
            element.addEventListener('click', (ev) => {
                this.dispatchEvent(new CustomEvent<ContextEventResult>('valueSelected', { detail: { ident: identValue, command: menuElementId } }));

            });
        });
    }

    getHTML(): string {

        let htmlString = "";
        const menuString = this.getAttribute('menu-entries');
        const parameters = JSON.parse(decodeURI(menuString));

        this.menuElements = new Set();

        for (const menu in parameters) {
            this.menuElements.add(parameters[menu]);
            htmlString = htmlString.concat(Component.html`
            <p class="context-menu__item" id="${parameters[menu]}">${menu}</p>
            `);
        }



        return Component.html` 
        <style>
            .context-menu {
            display: none;
            position: fixed;
            z-index: 10;
            padding: 5px 0;
            width: 240px;
            background-color: #fff;
            border: solid 1px #dfdfdf;
            box-shadow: 10px 10px 5px grey;
            border-radius: 10px;
            }

            .context-menu--active {
            display: block;
            }



            .context-menu__item {
            display: block;
            padding: 4px 12px;
            color: black;
            margin-bottom: 4px;
            font-size: 16px;
            text-align: left;
            text-decoration: none;
            text-indent: 10px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: normal;
            line-height: 1.0;            
            }

            .context-menu__item:last-child {
            margin-bottom: 0;
            }


            .context-menu__item:hover {
            
            background-color: rgba(0,0,0,0.5);
            }

        </style>
        <div id="context-menu" class="context-menu">
            ${htmlString}    
        </div>

        `;
    }





}
window.customElements.define('context-menu-programmatical', ContextMenuProgrammatical);

export { ContextMenuProgrammatical, ContextEventResult };

