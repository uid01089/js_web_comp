//import { LitElement, html } from '@polymer/lit-element';
import { Component } from '../js_web_comp_lib/Component';



class TabView extends Component {
    name: String;

    constructor() {
        super();

    }

    connectedCallback() {
        console.log('TabView added to page.');

    }

    getHTML() {

        return Component.html` 
        <style>
        </style>
        <div></div>

        `;
    }


    getName(): String {

        return this.name;
    }

}
window.customElements.define('tab-view', TabView);

export { TabView };

