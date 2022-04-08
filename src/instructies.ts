type InstructieOS = 'android' | 'ios';

let huidigOs: InstructieOS;

window.addEventListener('load', () => {
    let androidBtn = document.getElementById('android-btn');
    let iosBtn = document.getElementById('ios-btn');

    androidBtn.addEventListener('click', () => selectInstructies('android'));
    iosBtn.addEventListener('click', () => selectInstructies('ios'));

    // Detecteer besturingssysteem
    let userAgent = navigator.userAgent || navigator.vendor;
    
    if (/windows phone/i.test(userAgent)) {
        console.warn('Windows Phone gedetecteerd, daarvoor zijn geen instructies dus default is android.');
        
        selectInstructies('android');
    } else if (/android/i.test(userAgent)) {
        selectInstructies('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        selectInstructies('ios');
    } else {
        console.warn('Geen smartphone besturingssysteem gedetecteerd, dus default is android.');
        
        selectInstructies('android');
    }
});

function selectInstructies(os: InstructieOS) {
    let instructies = document.getElementById(os);
    let huidig = document.getElementById(huidigOs);
    
    instructies.style.display = 'block';
    document.getElementById(`${os}-btn`).classList.add('selected');    

    if (huidig) {
        huidig.style.display = 'none';
        document.getElementById(`${huidigOs}-btn`).classList.remove('selected');
    }
    
    huidigOs = os;
}
