import * as pdfjsLib from "pdfjs-dist";
import { Firebase } from "./firebase";
import type { Krant } from "./krant";
import { Viewer } from "./viewer";
import * as ServiceworkerHandler from './serviceworkerHandler';
import { User } from "./user";

// Registreer de service worker
if (ServiceworkerHandler.shouldUseServiceWorker(true)) {
    ServiceworkerHandler.registerServiceWorker();

    ServiceworkerHandler.onUpdate(() => {
        document.getElementById('update-info').classList.remove('hidden');
        setTimeout(() => {
            window.location.reload()
        }, 3000);
    });
}

pdfjsLib.GlobalWorkerOptions.workerSrc = './dist/pdf.worker.bundle.js';

User.onFirstVisit = () => {
    alert("Welkom!");
};

export let user: User;

window.addEventListener('load', () => {
    // App setup
    let viewerContainer = <HTMLDivElement> document.getElementById("viewer");
    let viewer = new Viewer(viewerContainer);
    let currentKrant: Krant = null;

    user = new User();
    
    // Drop up events
    let dropupBtn = document.getElementById("dropup-btn");

    dropupBtn.addEventListener('click', toggleDropup);
    
    // Error info events
    document.getElementById("close-error").addEventListener('click', toggleError);
    document.getElementById("more-info").addEventListener('click', () => {
        document.getElementById("error-details").classList.add("show");
    });

    window.addEventListener("resize", () => {
        checkBars();
    });

    // Haal een lijst met uitgaves op
    Firebase.getUitgaves().then(uitgaves => {
        // Vul de dropup met uitgaves
        let uitgavesUl = document.getElementById("uitgaves");

        uitgaves.forEach(uitgave => {
            let li = document.createElement("li");
            li.id = uitgave.name;
            li.innerHTML = uitgave.name;
            li.addEventListener('click', () => {
                setCurrentKrant(uitgave);
                toggleDropup();
            });

            uitgavesUl.appendChild(li);
        });

        // Zet de huidige titel naar "geen krant gevonden" als de array leeg is
        if (uitgaves.length === 0) {
            setHuidigeTitel("Geen krant gevonden");
        }

        // Voeg een placeholder toe als er maar 1 uitgave is en de dropup dus leeg is
        if (uitgaves.length === 1) {
            let li = document.createElement("li");
            li.id = "placeholder";
            li.innerHTML = "Er zijn nog geen eerdere uitgaves, wanneer die er wel zijn komen ze hier te staan.";

            uitgavesUl.appendChild(li);
        }

        // Laad de eerste krant als deze er is
        if (uitgaves.length > 0) setCurrentKrant(uitgaves[0]);
        else document.getElementById("spinner").classList.add("hidden");

        checkBars();
    }).catch(error => {
        setError(error);
        toggleError();
    });
    
    // Handige functies
    function toggleDropup() {
        let dropup = document.getElementById("dropup");
    
        dropup.classList.toggle("opened");
        document.getElementById("icon").innerHTML = dropup.classList.contains("opened") ? "arrow_drop_down" : "arrow_drop_up";
    }
    
    function setHuidigeTitel(titel: string) {
        document.getElementById("huidig").innerHTML = titel;
    }

    function checkBars() {
        if (innerHeight < 400 && innerHeight < innerWidth) {
            document.querySelector("header").style.display = 'none';
            document.querySelector("footer").style.display = 'none';
            document.getElementById("viewer").style.maxHeight = '100vh';
        } else {
            document.querySelector("header").style.display = 'flex';
            document.querySelector("footer").style.display = 'flex';
            document.getElementById("viewer").style.maxHeight = 'calc(100vh - 55px - 23px - 23px - 60px)';
        }
    }
    
    function setCurrentKrant(krant: Krant) {
        if (currentKrant) document.getElementById(currentKrant.name).style.display = '';

        currentKrant = krant;
    
        viewer.setKrant(krant);
        setHuidigeTitel(krant.name);
        document.getElementById(currentKrant.name).style.display = 'none';
    }
});


export function toggleError() {
    let errorInfo = document.getElementById("error-info");

    errorInfo.hidden = !errorInfo.hidden;

    if (errorInfo.hidden) {
        document.getElementById("error-details").classList.remove("show");
    }
}

export function setError(error: Error) {
    let errorDetails = document.getElementById("error-details");

    errorDetails.innerHTML = `<h3>${error.message}</h3>\n<p>${error.stack}</p>`;
}
