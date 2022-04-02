import * as pdfjsLib from "pdfjs-dist";
import { Firebase } from "./firebase";
import type { Krant } from "./krant";
import { Viewer } from "./viewer";

pdfjsLib.GlobalWorkerOptions.workerSrc = './dist/pdf.worker.bundle.js';

window.addEventListener('load', () => {
    let viewerContainer = <HTMLDivElement> document.getElementById("viewerContainer");
    let viewer = new Viewer(viewerContainer);
    let firebase = new Firebase();
    let kranten: Krant[] = [];

    // Events voor de select van de uitgaves
    let select = <HTMLSelectElement> document.getElementById("uitgaves");

    select.addEventListener('change', (event) => {
        let uitgaveNaam = select.value;

        // Zoek de krant met de juiste naam op in de array
        for (let krant of kranten) {
            if (krant.getName() === uitgaveNaam) {
                viewer.setKrant(krant);
                break;
            }
        }
    });
    
    firebase.getUitgaves().then(uitgaves => {
        kranten = uitgaves;

        // Vul de select met options
        uitgaves.forEach(uitgave => {
            let option = document.createElement("option");
            option.value = uitgave.getName();
            option.innerText = uitgave.getName();
            select.appendChild(option);
        });

        // Laad de eerste krant
        // TODO: kijk naar meeste recente uitgave eerst
        viewer.setKrant(uitgaves[0]);
    });

    // Registreer de service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceworker.bundle.js');
    }
});