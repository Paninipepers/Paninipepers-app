import * as pdfjsLib from "pdfjs-dist";
import { Firebase } from "./firebase";
import { Viewer } from "./viewer";

pdfjsLib.GlobalWorkerOptions.workerSrc = './dist/pdf.worker.bundle.js';

window.addEventListener('load', () => {
    let viewerContainer = <HTMLDivElement> document.getElementById("viewerContainer");
    let viewer = new Viewer(viewerContainer);
    let firebase = new Firebase();

    // Drop up events
    let dropupBtn = document.getElementById("dropup-btn");

    dropupBtn.addEventListener('click', toggleDropup);
    
    // Haal een lijst met uitgaves op
    firebase.getUitgaves().then(uitgaves => {
        // Vul de dropup met uitgaves
        let uitgavesUl = document.getElementById("uitgaves");

        uitgaves.forEach(uitgave => {
            let li = document.createElement("li");
            li.innerHTML = uitgave.getName();
            li.addEventListener('click', () => {
                viewer.setKrant(uitgave);
                setHuidigeTitel(uitgave.getName());
                toggleDropup();
            });

            uitgavesUl.appendChild(li);
        });

        // Laad de eerste krant
        // TODO: kijk naar meeste recente uitgave eerst
        viewer.setKrant(uitgaves[0]);
        setHuidigeTitel(uitgaves[0].getName());
    });

    // Registreer de service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceworker.bundle.js');
    }
});

function toggleDropup() {
    let dropup = document.getElementById("dropup");

    dropup.classList.toggle("opened");
    document.getElementById("icon").innerHTML = dropup.classList.contains("opened") ? "arrow_drop_down" : "arrow_drop_up";
}

function setHuidigeTitel(titel: string) {
    document.getElementById("huidig").innerHTML = titel;
}
