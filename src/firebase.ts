import { FirebaseApp, initializeApp } from 'firebase/app';
import { deleteObject, FirebaseStorage, getDownloadURL, getStorage, listAll, ref as refS, uploadBytes } from 'firebase/storage';
import { Auth, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Database, getDatabase, set, ref as refD, query, get, onValue, remove } from 'firebase/database';
import { Krant } from './krant';

const firebaseConfig = {
    apiKey: "AIzaSyC36ZvdiHsslbnFk6tp8MzKSDh8A3t1ZLU",
    authDomain: "paninipepers.firebaseapp.com",
    databaseURL: "https://paninipepers-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "paninipepers",
    storageBucket: "paninipepers.appspot.com",
    messagingSenderId: "41628347356",
    appId: "1:41628347356:web:3b19baa0c9c7c35fde7d19"
  };

export class Firebase {
    private app: FirebaseApp;
    private storage: FirebaseStorage;
    private auth: Auth;
    private database: Database;

    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.storage = getStorage(this.app);
        this.auth = getAuth(this.app);
        this.database = getDatabase(this.app);
    }

    getUitgaves(): Promise<Krant[]> {
        let uitgaves: Krant[] = [];
        
        return get(refD(this.database, "/")).then(snapshot => {
            snapshot.forEach(child => {
                let krant = new Krant(child.val().url, new Date(child.val().date), child.val().filename, child.val().name);
                uitgaves.push(krant);
            });

            uitgaves = uitgaves.sort((a, b) => a.uitgaveDatum.getTime() - b.uitgaveDatum.getTime()).reverse();

            return uitgaves;
        });

    }

    login(email: string, password: string): Promise<string> {
        return signInWithEmailAndPassword(this.auth, email, password).then(() => "").catch(error => error.message);
    }

    logout(): Promise<void> {
        return signOut(this.auth);
    }

    uploadKrant(file: File, name: string, date: Date): Promise<string> {
        return uploadBytes(refS(this.storage, `${file.name}`), file).then(async snapshot => {
            let url = await getDownloadURL(snapshot.ref);
            
            return set(refD(this.database, `/${name}`), {
                url: url,
                date: date.toISOString(),
                name: name,
                filename: file.name
            }).then(() => "").catch(error => error.message);
        }).catch(error => error.message);
    }

    deleteKrant(huidig: Krant): Promise<string> {
        return deleteObject(refS(this.storage, `${huidig.filename}`)).then(() => {
            return remove(refD(this.database, `/${huidig.getName()}`)).then(() => "").catch(error => error.message);            
        }).catch(error => error.message);
    }
}