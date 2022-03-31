import * as pdfjsLib from "pdfjs-dist";
import { Krant } from "./krant";
import { Viewer } from "./viewer";

pdfjsLib.GlobalWorkerOptions.workerSrc = './dist/pdf.worker.bundle.js';

window.addEventListener('load', () => {
    let viewerContainer = <HTMLDivElement> document.getElementById("viewerContainer");
    let viewer = new Viewer(viewerContainer);
    let krant = new Krant('krant/test.pdf');

    viewer.setKrant(krant);
});