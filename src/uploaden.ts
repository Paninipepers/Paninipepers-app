import { Firebase } from "./firebase";

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

    uitgaveDatum.value = new Date().toISOString().substring(0, 10);

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
            spinner.style.display = 'none';
            
            if (result.length !== 0) {
                uploadError.innerHTML = `Kon niet uploaden: ${result}`;
                uploadError.style.display = 'inline-block';
                uploadPopup.style.display = 'flex';
            } else {

            }
        });
    });

    function loggedIn() {
        window.addEventListener('beforeunload', () => {
            firebase.logout();
        });

        spinner.style.display = 'none';
        uploadPopup.style.display = 'flex';
    }
});
