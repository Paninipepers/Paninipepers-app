import { Firebase } from "./firebase";
import type { Krant } from "./krant";

window.addEventListener('load', () => {
    let loginPopup = document.getElementById('login');
    let email = document.getElementById('email') as HTMLInputElement;
    let password = document.getElementById('password') as HTMLInputElement;
    let loginBtn = document.getElementById('login-btn');
    let loginError = document.getElementById('login-error');
    
    let uploadPopup = document.getElementById('upload-popup');
    let uitgaveNaam = document.getElementById('name') as HTMLInputElement;
    let uitgaveDatum = document.getElementById('date') as HTMLInputElement;
    let uitgaveFile = document.getElementById('file-input') as HTMLInputElement;
    let gekozen = document.getElementById('gekozen');
    let uploadBtn = document.getElementById('upload-btn');
    let uploadError = document.getElementById('upload-error');
    let uploadClose = document.getElementById('upload-close');
    
    uitgaveDatum.value = new Date().toISOString().substring(0, 10);
    
    let uitgavesPopup = document.getElementById('uitgaves-popup');
    let uitgavesError = document.getElementById('uitgaves-error');
    let newBtn = document.getElementById('new') as HTMLButtonElement;
    let downloadBtn = document.getElementById('download') as HTMLButtonElement;
    let deleteBtn = document.getElementById('delete') as HTMLButtonElement;
    let uitgaveList = document.getElementById('uitgaves');

    let huidig: Krant = null;
    let spinner = document.getElementById("spinner");
    let firebase = new Firebase();

    loginBtn.addEventListener('click', () => {
        if (email.value.length <= 0 || password.value.length <= 0) {
            loginError.innerHTML = "Vul alle velden in.";
            loginError.style.display = 'inline-block';
            return;
        }

        spinner.style.display = 'inline-block';
        loginPopup.style.display = 'none';

        firebase.login(email.value, password.value).then(result => {
            if (result.length !== 0) {
                loginError.innerHTML = `Kon niet inloggen: ${result}`;
                loginError.style.display = 'inline-block';
                spinner.style.display = 'none';
                loginPopup.style.display = 'flex';
            } else loggedIn();
        });
    });

    uitgaveFile.addEventListener('change', () => {
        gekozen.innerText = uitgaveFile.files[0].name;
    });

    uploadBtn.addEventListener('click', () => {
        if (uitgaveNaam.value.length <= 0 || !uitgaveDatum.valueAsDate || uitgaveFile.files.length <= 0) {
            uploadError.innerHTML = "Vul alle velden in.";
            uploadError.style.display = 'inline-block';
            return;
        }

        let file = uitgaveFile.files[0];

        if (file.type !== 'application/pdf') {
            uploadError.innerHTML = "Kies een PDF bestand.";
            uploadError.style.display = 'inline-block';
            return;
        }

        spinner.style.display = 'inline-block';
        uploadPopup.style.display = 'none';

        firebase.uploadKrant(file, uitgaveNaam.value, uitgaveDatum.valueAsDate).then(result => {
            fillUitgavesList().then(() => {
                spinner.style.display = 'none';
                
                if (result.length !== 0) {
                    uploadError.innerHTML = `Kon niet uploaden: ${result}`;
                    uploadError.style.display = 'inline-block';
                    uploadPopup.style.display = 'flex';
                } else {
                    uitgavesPopup.style.display = 'flex';
                    clearUploadPopup();
                }
            });
        });
    });

    newBtn.addEventListener('click', () => {
        uploadPopup.style.display = 'flex';
        uitgavesPopup.style.display = 'none';
    });

    uploadClose.addEventListener('click', () => {
        uploadPopup.style.display = 'none';
        uitgavesPopup.style.display = 'flex';
        clearUploadPopup();
    });

    downloadBtn.addEventListener('click', () => {
        if (!huidig) return;

        spinner.style.display = 'inline-block';
        uitgavesPopup.style.display = 'none';

        downloadURL(huidig.url, `${huidig.name}.pdf`).then(() => {
            spinner.style.display = 'none';
            uitgavesPopup.style.display = 'flex';
        });
    });

    deleteBtn.addEventListener('click', () => {
        if (!huidig) return;

        uitgavesPopup.style.display = 'none';
        spinner.style.display = 'inline-block';

        firebase.deleteKrant(huidig).then(result => {
            fillUitgavesList().then(() => {
                spinner.style.display = 'none';

                if (result.length !== 0) {
                    uitgavesError.innerHTML = `Kon niet verwijderen: ${result}`;
                    uitgavesError.style.display = 'inline-block';
                } else {
                    downloadBtn.disabled = true;
                    deleteBtn.disabled = true;
                    huidig = null;
                }

                uitgavesPopup.style.display = 'flex';
            });
        });
    });

    function loggedIn() {
        window.addEventListener('beforeunload', () => {
            firebase.logout();
        });

        fillUitgavesList().then(() => {
            spinner.style.display = 'none';
            uitgavesPopup.style.display = 'flex';
        });
    }

    function clearUploadPopup() {
        uitgaveNaam.value = '';
        uitgaveDatum.value = new Date().toISOString().substring(0, 10);
        uitgaveFile.value = '';
        gekozen.innerText = '';
    }
    
    function fillUitgavesList() {
        return firebase.getUitgaves().then(uitgaves => {
            uitgaveList.innerHTML = '';
    
            uitgaves.forEach(uitgave => {
                let uitgaveItem = document.createElement('li');
                
                uitgaveItem.addEventListener('click', () => {
                    if (huidig === uitgave) {
                        uitgaveItem.classList.remove('selected');
                        downloadBtn.disabled = true;
                        deleteBtn.disabled = true;
                        huidig = null;
                    } else {
                        if (huidig) document.getElementById(huidig.name).classList.remove('selected');
    
                        uitgaveItem.classList.add('selected');
                        downloadBtn.disabled = false;
                        deleteBtn.disabled = false;
                        huidig = uitgave;
                    }
                });
                
                uitgaveItem.innerHTML = `${uitgave.name}`;
                uitgaveItem.id = `${uitgave.name}`;
                uitgaveList.appendChild(uitgaveItem);
            });
        });
    }

    async function downloadURL(url: string, filename: string) {
        let blob = await fetch(url).then(response => response.blob());
        let urlObj = URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = urlObj;
        a.download = filename;

        a.click();

        setTimeout(() => URL.revokeObjectURL(urlObj), 60 * 1000);
    }
});

