
import { CSS } from '../Css';

import { Component } from '../js_web_comp_lib/Component';
import { ReduxComponent } from '../js_web_comp_lib/ReduxComponent';



class LoaderElement extends Component {



    constructor() {

        super();
    }

    /**
     * Called every time the element is inserted into the DOM. Useful for running setup code,
     * such as fetching resources or rendering. Generally, you should try to delay work until
     * this time.
     */
    connectedCallback(): void {
        super.connectedCallback();


    }

    /**
     * Can be used to register call back operations
     *
     * @memberof Component
     */
    registerCallBack(): void {
        super.registerCallBack();

    }

    /**
     * Returns the HTML from which a template shall be created
     */
    getHTML(): string {

        const color = this.getAttribute('color') || '#fff';

        return ReduxComponent.html` 
        ${CSS}

        <style>
        .lds-dual-ring {
            display: inline-block;
            width: 80px;
            height: 80px;
        }
        .lds-dual-ring:after {
            content: " ";
            display: block;
            width: 64px;
            height: 64px;
            margin: 8px;
            border-radius: 50%;
            border: 6px solid ${color};
            border-color: ${color} transparent ${color} transparent;
            animation: lds-dual-ring 1.2s linear infinite;
        }
        @keyframes lds-dual-ring {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        </style>
        <div class="lds-dual-ring"></div>

        `;
    }

}
window.customElements.define('loader-element', LoaderElement);

export { LoaderElement };

