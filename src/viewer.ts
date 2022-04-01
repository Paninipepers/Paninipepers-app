import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import type { Krant } from "./krant";


export class Viewer {
    private krant: Krant;
    private container: HTMLDivElement;
    private eventBus: pdfjsViewer.EventBus;
    private linkService: pdfjsViewer.PDFLinkService;
    private viewer: pdfjsViewer.PDFViewer;

    constructor(container: HTMLDivElement) {
        this.container = container;
        this.eventBus = new pdfjsViewer.EventBus();
        this.linkService = new pdfjsViewer.PDFLinkService({ eventBus: this.eventBus });
        this.viewer = new pdfjsViewer.PDFViewer({
            container: this.container,
            eventBus: this.eventBus,
            linkService: this.linkService,
            l10n: pdfjsViewer.NullL10n,
            useOnlyCssZoom: true,
            textLayerMode: 0,
            renderer: 'canvas'
        });

        this.linkService.setViewer(this.viewer);
    }

    setKrant(krant: Krant) {
        this.krant = krant;

        this.krant.load().then(() => {
            this.viewer.setDocument(this.krant.pdfDocumentProxy);
            this.linkService.setDocument(this.krant);
        });
    }
}