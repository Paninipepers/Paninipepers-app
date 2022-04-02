import type { Krant } from "./krant";

export class Viewer {
    private krant: Krant;
    private container: HTMLDivElement;  
    
    constructor(container: HTMLDivElement, public scale: number = 1) {
        this.container = container;
    }

    setKrant(krant: Krant) {
        if (this.krant) {
            this.container.innerHTML = "";
        }

        this.krant = krant;
        this.krant.load().then(() => {
            let pages = this.krant.pdfDocumentProxy.numPages;

            for(let i = 1; i <= pages; i++) {
                let canvas = document.createElement("canvas");

                canvas.id = `${this.krant.getName()}-page-${i}`;
                canvas.width = (innerWidth > innerHeight ? innerWidth : innerHeight) * 0.95; // 95% van de langste zijde van de window

                this.container.appendChild(canvas); // Voeg canvas toe aan de viewer
                this.krant.render(i, <CanvasRenderingContext2D> canvas.getContext("2d"), this.scale); // Render de pagina
            }
        });
    }

    get width() {
        return this.container.clientWidth;
    }
}