
import { ContextMenuProgrammatical, ContextEventResult } from './ContextMenuProgrammatical'



class ContextMenu extends ContextMenuProgrammatical {



    constructor() {
        super();
    }

    registerCallBack(): void {
        const identValue = this.getAttribute('ident');
        this.registerCustomEvents(identValue);
    }

    connectedCallback(): void {
        super.connectedCallback();

        const parent = this.parentNode;
        const elementId = this.getAttribute('elementid');
        const type = this.getAttribute('type');

        const targetElement = parent.querySelector('#' + elementId);




        targetElement.addEventListener(type, (ev) => {
            this.showMenu(ev as MouseEvent);
        });




    }

}
window.customElements.define('context-menu', ContextMenu);

export { ContextMenu, ContextEventResult };

