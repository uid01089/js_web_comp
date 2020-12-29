
import { Component } from '../js_web_comp_lib/Component';
import { Debounce } from '../js_lib/Debounce';

interface MidiWindowEventResult {
    mutations: MutationRecord[]
}


class MidiWindow extends Component {

    pos1: number;
    pos2: number;
    pos3: number;
    pos4: number;
    observer: MutationObserver;
    debounceMutationObserver: Debounce;



    constructor() {
        super();

        this.debounceMutationObserver = new Debounce(500);





        this.observer = new MutationObserver((mutations: MutationRecord[], observer: MutationObserver) => {
            this.debounceMutationObserver.trigger(() => {
                this.dispatchEvent(new CustomEvent<MidiWindowEventResult>('midiWindowChanged', { detail: { mutations: mutations } }));
            });

        });


    }

    connectedCallback(): void {
        super.connectedCallback();

        const windowElement = this.shadowRoot.getElementById("midiWindow") as HTMLScriptElement;

        // Options for the observer (which mutations to observe)
        const config: MutationObserverInit = { attributes: true, childList: false, subtree: false };
        this.observer.observe(windowElement, config);


    }



    registerCallBack(): void {

        const headerElement = this.shadowRoot.getElementById("midiWindowHeader") as HTMLScriptElement;
        const windowElement = this.shadowRoot.getElementById("midiWindow") as HTMLScriptElement;
        const buttonElement = this.shadowRoot.getElementById("button") as HTMLScriptElement;


        headerElement.addEventListener('mousedown', (ev) => {
            this.dragMouseDown(ev, windowElement, headerElement);
        });

        buttonElement.addEventListener('click', (ev) => {
            console.log("clicked");
            this.hide();
        });





    }

    show(): void {
        const midiWindow = this.shadowRoot.querySelector("#midiWindow") as HTMLScriptElement;
        midiWindow.classList.remove("midiWindowInactive");
        midiWindow.classList.add("midiWindowActive");
    }

    hide(): void {
        const midiWindow = this.shadowRoot.querySelector("#midiWindow") as HTMLScriptElement;
        midiWindow.classList.remove("midiWindowActive");
        midiWindow.classList.add("midiWindowInactive");
    }

    getHTML(): string {


        const title = this.getAttribute('title') || "";


        return Component.html` 
        <style>
            #midiWindow {
            
            position: absolute;
            z-index: 20;
            background-color: #f1f1f1;
            border: 1px solid #d3d3d3;
            text-align: center;
            resize: both;
            overflow: auto; 
            box-shadow: 10px 10px 5px grey;
            border-radius: 10px;
            }

            .midiWindowActive {
                display: block;
            }

            .midiWindowInactive {
                display: none;
            }

            #midiWindowHeader {
            padding: 10px;
            cursor: move;
            z-index: 21;
            background-color: #2196F3;
            color: #fff;
            }

 
            #button
            {
           
            display: block;
            position: absolute;
            top: 10px;
            right: 10px;
            width: 20px;
            
            z-index: 50;
            
            -webkit-user-select: none;
            user-select: none;
            
            }

            /*
            * Just a quick hamburger
            */
            #button span
            {
            display: block;
            width: 20px;
            height: 2px;
            margin-bottom: 5px;
            position: relative;
            
            background: #636262;
            border-radius: 3px;
            
            z-index: 1;
            
            transform-origin: 4px 0px;
            
            transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                        background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                        opacity 0.55s ease;
            }

            #button span:first-child
            {
            transform-origin: 0% 0%;
            }

            #button span:nth-last-child(2)
            {
            transform-origin: 0% 100%;
            }

            #content{
                display:block;
                height:90%;
                width:100%;
                z-index: 1;
            }

        </style>
        
        <!-- Draggable DIV -->
        <div id="midiWindow" class="midiWindowActive">
            <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
            <div id="midiWindowHeader">${title}
                
                <div id="button">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>        
            </div>

            
            <div id="content">
                <slot name="content"><p>None</p></slot>
            </div> 
            
        
  
        </div>

        `;
    }



    dragMouseDown(e: MouseEvent, windowElement: HTMLScriptElement, headerElement: HTMLScriptElement): void {
        e.preventDefault();

        // get the mouse cursor position at startup:
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;

        const elementDrag = ((ev) => {
            this.elementDrag(ev as MouseEvent, windowElement);
        }) as EventListener;

        const closeDragElement = ((ev) => {
            this.closeDragElement(headerElement, elementDrag, closeDragElement);
        }) as EventListener;

        // Register MouseMove and MouseUp events
        headerElement.addEventListener('mousemove', elementDrag);
        headerElement.addEventListener('mouseup', closeDragElement);
        headerElement.addEventListener('mouseleave', closeDragElement);



    }

    elementDrag(e: MouseEvent, windowElement: HTMLScriptElement) {
        e.preventDefault();


        // calculate the new cursor position:
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;

        // set the element's new position:
        windowElement.style.top = (windowElement.offsetTop - this.pos2) + "px";
        windowElement.style.left = (windowElement.offsetLeft - this.pos1) + "px";



    }

    closeDragElement(headerElement: HTMLScriptElement, elementDrag: EventListener, closeDragElement: EventListener): void {
        /* stop moving when mouse button is released:*/
        headerElement.removeEventListener('mousemove', elementDrag);
        headerElement.removeEventListener('mouseup', closeDragElement);
        headerElement.removeEventListener('mouseleave', closeDragElement);
    }



}
window.customElements.define('midi-window', MidiWindow);

export { MidiWindow, MidiWindowEventResult };

