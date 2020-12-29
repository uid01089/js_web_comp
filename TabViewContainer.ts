
import { Component } from '../js_web_comp_lib/Component';
import { TabView } from './TabView';

interface TabViewContainerResult {
    selectedTab: string
}

class TabViewContainer extends Component {
    selection: string;
    tabs: HTMLElement[];
    tabButtons: HTMLButtonElement[];

    constructor() {
        super();

        this.selection = "";

    }

    connectedCallback() {
        console.log('TabViewContainer added to page.');

        const tabButtonSlot = this.shadowRoot.getElementById("tabButtonSlot") as HTMLSlotElement;
        const tabSlot = this.shadowRoot.getElementById("tabSlot") as HTMLSlotElement;

        this.tabButtons = tabButtonSlot.assignedElements({ flatten: true }) as HTMLButtonElement[];
        this.tabs = tabSlot.assignedElements({ flatten: true }) as HTMLElement[];

        // Connect buttons and tabs
        for (var i = 0; i < this.tabButtons.length; i++) {
            let name = this.tabButtons[i].textContent;
            this.tabButtons[i].classList.add('tabLink');
            this.tabs[i].id = name;
            this.tabs[i].classList.add('tabContent');

            this.tabButtons[i].addEventListener("click", (ev) => {
                this.openTab(ev);
                this.dispatchEvent(new CustomEvent<TabViewContainerResult>('TabSelected', { detail: { selectedTab: name } }));
            });

        }




    }


    getHTML() {




        return Component.html` 
        <style>
            /* Style the tab */
            .tab {
            overflow: hidden;
            border: 1px solid #ccc;
            background-color: #f1f1f1;
            }

            /* Style the buttons inside the tab */
            .tab ::slotted(button) {
            background-color: inherit;
            float: left;
            border: none;
            outline: none;
            cursor: pointer;
            padding: 14px 16px;
            transition: 0.3s;
            font-size: 17px;
            }

            /* Change background color of buttons on hover */
            .tab ::slotted(button:hover) {
            background-color: #ddd;
            }

            /* Create an active/current tablink class */
            .tab ::slotted(button.active) {
            background-color: #ccc;
            }

            /* Style the tab content */
            ::slotted(*.tabContent) {
            display: none;
            padding: 6px 12px;
            border: 1px solid #ccc;
            border-top: none;
            overflow: visible;
            }            
        </style>

        <div class="tab">
            <slot id="tabButtonSlot" name="tabButton"></slot>
        </div>       
        <slot id="tabSlot" name="tab"></slot>


        `;



    }


    openTab(evt: Event) {

        let pressedButton = evt.currentTarget as HTMLButtonElement;
        this.selection = pressedButton.textContent;

        // Hide all tabs except the needed one
        this.tabs.forEach((tabElement) => {
            if (tabElement.id === this.selection) {
                tabElement.style.display = "block";
            } else {
                tabElement.style.display = "none";
            }
        });

        // Inactive all Buttons
        this.tabButtons.forEach((button) => {
            button.className = button.className.replace(" active", "");
        });


        pressedButton.className += " active";
    }

}
window.customElements.define('tab-view-container', TabViewContainer);

export { TabViewContainerResult };

