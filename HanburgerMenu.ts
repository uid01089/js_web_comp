//import { LitElement, html } from '@polymer/lit-element';
import { Component } from '../js_web_comp_lib/Component';

interface ContextEventResult {
    ident: string,
    command: string
}

class HanburgerMenu extends Component {


    static menuPresent = false;
    menuElements: Set<string>;

    constructor() {
        super();


    }

    connectedCallback() {
        super.connectedCallback();

        const parent = this.parentNode;
        const elementId = this.getAttribute('elementid');
        const type = this.getAttribute('type');
        const ident = this.getAttribute('ident');

        const targetElement = parent.querySelector('#' + elementId);


    }



    registerCallBack() {
        var identValue = this.getAttribute('ident');
        this.menuElements.forEach((menuElementId) => {
            var element = this.shadowRoot.getElementById(menuElementId);
            element.addEventListener('click', (ev) => {
                this.dispatchEvent(new CustomEvent<ContextEventResult>('valueSelected', { detail: { ident: identValue, command: menuElementId } }));
            });

        });
    }

    getHTML() {

        var htmlString = "";
        var menuString = this.getAttribute('menu-entries');
        var parameters = JSON.parse(decodeURI(menuString));

        this.menuElements = new Set();

        for (var menu in parameters) {
            this.menuElements.add(parameters[menu]);
            htmlString = htmlString.concat(Component.html`
            <p class="context-menu__item" id="${parameters[menu]}">${menu}</p>
            `);
        }



        return Component.html` 
        <style>
            body
            {
            margin: 0;
            padding: 0;
            
            /* make it look decent enough */
            background: #232323;
            color: #cdcdcd;
            font-family: "Avenir Next", "Avenir", sans-serif;
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

            #menuToggle
            {
            display: block;
            position: relative;
            top: 50px;
            left: 50px;
            width: 33px;
            
            z-index: 1;
            
            -webkit-user-select: none;
            user-select: none;
            }

            #menuToggle input
            {
            display: block;
            width: 40px;
            height: 32px;
            position: absolute;
            top: -7px;
            left: -5px;
            
            cursor: pointer;
            
            opacity: 0; /* hide this */
            z-index: 2; /* and place it over the hamburger */
            
            -webkit-touch-callout: none;
            }

            /*
            * Just a quick hamburger
            */
            #menuToggle span
            {
            display: block;
            width: 33px;
            height: 4px;
            margin-bottom: 5px;
            position: relative;
            
            background: #cdcdcd;
            border-radius: 3px;
            
            z-index: 1;
            
            transform-origin: 4px 0px;
            
            transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                        background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                        opacity 0.55s ease;
            }

            #menuToggle span:first-child
            {
            transform-origin: 0% 0%;
            }

            #menuToggle span:nth-last-child(2)
            {
            transform-origin: 0% 100%;
            }

            /* 
            * Transform all the slices of hamburger
            * into a crossmark.
            */
            #menuToggle input:checked ~ span
            {
            opacity: 1;
            transform: rotate(45deg) translate(-2px, -1px);
            background: #232323;
            }

            /*
            * But let's hide the middle one.
            */
            #menuToggle input:checked ~ span:nth-last-child(3)
            {
            opacity: 0;
            transform: rotate(0deg) scale(0.2, 0.2);
            }

            /*
            * Ohyeah and the last one should go the other direction
            */
            #menuToggle input:checked ~ span:nth-last-child(2)
            {
            transform: rotate(-45deg) translate(0, -1px);
            }

            /*
            * Make this absolute positioned
            * at the top left of the screen
            */
            #menu
            {
            position: absolute;
            width: 300px;
            margin: -100px 0 0 -50px;
            padding: 50px;
            padding-top: 125px;
            
            background: #ededed;
            list-style-type: none;
            -webkit-font-smoothing: antialiased;
            /* to stop flickering of text in safari */
            
            transform-origin: 0% 0%;
            transform: translate(-100%, 0);
            
            transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
            }

            #menu li
            {
            padding: 10px 0;
            font-size: 22px;
            }

            /*
            * And let's slide it in from the left
            */
            #menuToggle input:checked ~ ul
            {
            transform: none;
            }
        </style>
        
<nav role="navigation">
  <div id="menuToggle">
    <!--
    A fake / hidden checkbox is used as click reciever,
    so you can use the :checked selector on it.
    -->
    <input type="checkbox" />
    
    <!--
    Some spans to act as a hamburger.
    
    They are acting like a real hamburger,
    not that McDonalds stuff.
    -->
    <span></span>
    <span></span>
    <span></span>
    
    <!--
    Too bad the menu has to be inside of the button
    but hey, it's pure CSS magic.
    -->
    <ul id="menu">
      ${htmlString}
    </ul>
  </div>
</nav>

        `;
    }



}
window.customElements.define('hamburger-menu', HanburgerMenu);

export { HanburgerMenu, ContextEventResult };

