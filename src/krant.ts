import * as pdfjsLib from "pdfjs-dist";

export class Krant {
    private url: string;
    private pdf: pdfjsLib.PDFDocumentProxy;

    constructor(url: string) {
        this.url = url;
    }

    public async load() {
        this.pdf = await pdfjsLib.getDocument(this.url).promise;
    }

    get pdfDocumentProxy() {
        return this.pdf;
    }

    // get title(): Promise<string> {
    //     return !this.#pdf ? new Promise(() => "") : this.#pdf.getMetadata().then(data => {
    //         let metadata = data.metadata;
            
    //         if (metadata && metadata.has('dc:title')) {
    //             return metadata.get('dc:title');
    //         } else {
    //             return "";
    //         }
    //     })
    // }
}
