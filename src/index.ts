import * as pdfjsLib from "pdfjs-dist";
import { Firebase } from "./firebase";
import { Viewer } from "./viewer";

pdfjsLib.GlobalWorkerOptions.workerSrc = './dist/pdf.worker.bundle.js';

window.addEventListener('load', () => {
    let viewerContainer = <HTMLDivElement> document.getElementById("viewerContainer");
    let viewer = new Viewer(viewerContainer);
    let firebase = new Firebase();
    
    firebase.getUitgaves().then(uitgaves => {
        viewer.setKrant(uitgaves[0]);
    });
});