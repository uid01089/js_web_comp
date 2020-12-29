
import { Component } from '../js_web_comp_lib/Component';

interface FileDialogResult {
    files: FileList
}


type CallBackFct = (files: FileList) => void;

class FileDialog extends Component {
    callBack: CallBackFct;




    constructor() {
        super();

        this.callBack = null;
    }

    connectedCallback(): void {
        super.connectedCallback();
    }

    show(callback?: CallBackFct): void {
        if (callback != undefined) {
            this.callBack = callback;
        } else {
            this.callBack = null;
        }

        this.shadowRoot.getElementById("myInput").click();
    }



    registerCallBack(): void {
        const element = this.shadowRoot.getElementById("myInput") as HTMLInputElement;
        element.addEventListener('change',
            (e: Event) => {
                const files = (e.target as HTMLInputElement).files;
                if (files.length > 0) {
                    this.dispatchEvent(new CustomEvent<FileDialogResult>('valueSelected', { detail: { files: files } }));
                    this.callBack(files);
                }
            });
    }

    getHTML(): string {

        return Component.html` 
        <style>


        </style>
        
            <input id="myInput" type="file" style="visibility:hidden" />

        `;
    }









}
window.customElements.define('file-dialog', FileDialog);

export { FileDialog, FileDialogResult };

