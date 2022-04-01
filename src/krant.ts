import * as pdfjsLib from "pdfjs-dist";

export class Krant {
    private pdf: pdfjsLib.PDFDocumentProxy;

    constructor(private url: string, private name = "Onbekende naam") {}

    public async load() {
        this.pdf = await pdfjsLib.getDocument(this.url).promise;
    }

    get pdfDocumentProxy() {
        return this.pdf;
    }

    getUrl(): string {
        return this.url;
    }
}
