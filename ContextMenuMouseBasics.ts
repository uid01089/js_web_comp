import { Component } from '../js_web_comp_lib/Component';


interface Point {
    x: number,
    y: number
}


abstract class ContextMenuMouseBasics extends Component {


    static menuPresent = false;


    constructor() {
        super();


    }

    connectedCallback(): void {
        super.connectedCallback();





        // Hide in case of ESC-Key
        document.addEventListener("keydown", (ev) => {
            if (ev.keyCode === 27) {
                this.toggleMenuOff();
            }
        }, false);

        document.addEventListener('click', (ev) => {
            this.toggleMenuOff();
        });

    }

    showMenu(ev: MouseEvent): void {
        this.toggleMenuOn();
        this.positionMenu(ev as MouseEvent);
        ev.stopPropagation();
    }

    showMenuAndRegisterEvents(ev: MouseEvent, identValue: any): void {

        // Update to get rid of existing event listeners
        this.update();

        this.registerCustomEvents(identValue);
        this.showMenu(ev);

    }


    abstract registerCustomEvents(identValue: any): void;


    private positionMenu(e: MouseEvent): void {
        const clickCoords = this.getPosition(e);
        const clickCoordsX = clickCoords.x;
        const clickCoordsY = clickCoords.y;
        const menu = this.shadowRoot.querySelector("#context-menu") as HTMLScriptElement;

        const menuWidth = menu.offsetWidth + 4;
        const menuHeight = menu.offsetHeight + 4;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const sourceElementRect = (e.srcElement as HTMLScriptElement).getBoundingClientRect();

        if ((windowWidth - clickCoordsX) < menuWidth) {
            menu.style.left = windowWidth - menuWidth + "px";
        } else {
            menu.style.left = clickCoordsX + "px";
        }

        if ((windowHeight - clickCoordsY) < menuHeight) {
            menu.style.top = windowHeight - menuHeight + "px";
        } else {
            menu.style.top = clickCoordsY + "px";
        }
    }

    private getPosition(e: MouseEvent): Point {
        let posx = 0;
        let posy = 0;

        if (!e) e = window.event as MouseEvent;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }




        return {
            x: posx,
            y: posy
        }
    }

    protected toggleMenuOn(): void {
        const menu = this.shadowRoot.querySelector("#context-menu") as HTMLScriptElement;

        if (!ContextMenuMouseBasics.menuPresent) {
            ContextMenuMouseBasics.menuPresent = true;
            menu.classList.add("context-menu--active");
        }
    }


    protected toggleMenuOff(): void {
        const menu = this.shadowRoot.querySelector("#context-menu") as HTMLScriptElement;
        ContextMenuMouseBasics.menuPresent = false;
        menu.classList.remove("context-menu--active");
    }


}


export { ContextMenuMouseBasics };

