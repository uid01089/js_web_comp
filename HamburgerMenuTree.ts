import { Component } from '../js_web_comp_lib/Component';
import './ContextMenuTree';
import { ContextMenuTreeEventResult, CT_Config, ContextMenuTree } from './ContextMenuTree';



class HamburgerMenuTree extends Component {
    config: CT_Config;





    constructor() {
        super();


    }

    connectedCallback(): void {
        super.connectedCallback();

    }

    public setConfig(config: CT_Config): void {
        this.config = config;
        const context = this.shadowRoot.getElementById('contextMenu') as ContextMenuTree;
        context.setConfig(config);
    }



    registerCallBack(): void {
        const context = this.shadowRoot.getElementById('contextMenu');
        context.addEventListener('valueSelected', (e: CustomEvent) => {
            const details: ContextMenuTreeEventResult = e.detail;
            this.dispatchEvent(new CustomEvent<ContextMenuTreeEventResult>('valueSelected', { detail: { path: details.path, config: details.config, value: details.value } }));
        });

    }

    getHTML(): string {

        const menuString = this.getAttribute('menu-entries');

        const positionString = this.getAttribute('position');
        let position = 'relative';
        let top = '50px';
        let left = '50px';

        if (null != positionString) {
            const positionObj = JSON.parse(positionString);

            position = positionObj.position || position;
            top = positionObj.top || top;
            left = positionObj.left || left;
        }




        return Component.html` 
        <style>
 

 
            #menuToggle
            {
           
            display: block;
            position: ${position};
            top: ${top};
            left: ${left};
            width: 33px;
            
            z-index: 1;
            
            -webkit-user-select: none;
            user-select: none;
            
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
            
            background: #636262;
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


        </style>
        

  <div id="menuToggle">
    <span></span>
    <span></span>
    <span></span>
    
  </div>


    <context-menu-tree id="contextMenu" elementId="menuToggle"
        tree=${menuString} type='click' ident="">
    </context-menu-tree>

        `;
    }



}
window.customElements.define('hamburger-menu-tree', HamburgerMenuTree);

export { HamburgerMenuTree, ContextMenuTreeEventResult };

