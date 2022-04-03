import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseStorage, getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';
import { Krant } from './krant';

const firebaseConfig = {
    apiKey: "AIzaSyC36ZvdiHsslbnFk6tp8MzKSDh8A3t1ZLU",
    authDomain: "paninipepers.firebaseapp.com",
    projectId: "paninipepers",
    storageBucket: "paninipepers.appspot.com",
    messagingSenderId: "41628347356",
    appId: "1:41628347356:web:3b19baa0c9c7c35fde7d19"
  };

export class Firebase {
    private app: FirebaseApp;
    private storage: FirebaseStorage;

    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.storage = getStorage(this.app);
    }

    async getUitgaves(): Promise<Krant[]> {
        let uitgaves: Krant[] = [];
        let result = await listAll(ref(this.storage));

        for (let item of result.items) {
            let url = await getDownloadURL(item);
            let krant = new Krant(url, item.name.toLowerCase().replace(".pdf", "")); // Haal de naam van de uitgave eruit door de .pdf/.PDF te verwijderen

            uitgaves.push(krant);
        }

        return uitgaves;
    }
}