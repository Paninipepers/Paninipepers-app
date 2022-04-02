import * as pdfjsLib from "pdfjs-dist";

export class Krant {
    private pdf: pdfjsLib.PDFDocumentProxy;

    constructor(private url: string, private name = "Onbekende naam") {}

    public async load() {
        this.pdf = await pdfjsLib.getDocument(this.url).promise;
    }

    public async render(pageNum: number, target: CanvasRenderingContext2D, renderScale: number) {
        let page = await this.pdf.getPage(pageNum);
        let viewport = page.getViewport({ scale: renderScale });
        let scale = target.canvas.width / viewport.width;
        let scaledViewport = page.getViewport({ scale: scale });

        target.canvas.height = scaledViewport.height;

        page.render({
            canvasContext: target,
            viewport: scaledViewport
        });
    }

    get pdfDocumentProxy() {
        return this.pdf;
    }

    getUrl(): string {
        return this.url;
    }

    getName(): string {
        return this.name;
    }
}
