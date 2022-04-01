import { FirebaseApp, initializeApp } from 'firebase/app';
import { FirebaseStorage, getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';
import { Krant } from './krant';

// TODO: zet deze in een config file
const firebaseConfig = {
    apiKey: "AIzaSyCfT6IOjnRDE4WdscqkERG_MVJjnvodeYQ",
    authDomain: "adelbert-schoolkrant.firebaseapp.com",
    databaseURL: "https://adelbert-schoolkrant-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "adelbert-schoolkrant",
    storageBucket: "adelbert-schoolkrant.appspot.com",
    messagingSenderId: "106669703164",
    appId: "1:106669703164:web:22c84682f9831ed5f43c79"
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