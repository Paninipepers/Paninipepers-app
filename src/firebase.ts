import { FirebaseApp, initializeApp } from 'firebase/app';
import { deleteObject, FirebaseStorage, getDownloadURL, getStorage, ref as refS, uploadBytes } from 'firebase/storage';
import { Auth, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Database, getDatabase, set, ref as refD, get, remove } from 'firebase/database';
import { Krant } from './krant';
import { User } from './user';

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
    private static app: FirebaseApp = initializeApp(firebaseConfig);
    private static storage: FirebaseStorage = getStorage(this.app);
    private static auth: Auth = getAuth(this.app);
    private static database: Database = getDatabase(this.app);

    static getUitgaves(): Promise<Krant[]> {
        let uitgaves: Krant[] = [];
        
        return get(refD(this.database, "/uitgaves")).then(snapshot => {
            snapshot.forEach(child => {
                let krant = new Krant(child.val().url, new Date(child.val().date), child.val().uid, child.val().name);
                uitgaves.push(krant);
            });

            uitgaves = uitgaves.sort((a, b) => a.date.getTime() - b.date.getTime()).reverse();

            return uitgaves;
        });

    }

    static login(email: string, password: string): Promise<string> {
        return signInWithEmailAndPassword(this.auth, email, password).then(() => "").catch(error => error.message);
    }

    static logout(): Promise<void> {
        return signOut(this.auth);
    }

    static uploadKrant(file: File, name: string, date: Date): Promise<string> {
        let uid = generateUid(15);

        return uploadBytes(refS(this.storage, `${uid}.pdf`), file).then(async snapshot => {
            let url = await getDownloadURL(snapshot.ref);
            
            return set(refD(this.database, `/uitgaves/${uid}`), {
                url: url,
                date: date.toISOString(),
                name: name,
                uid: uid
            }).then(() => "").catch(error => error.message);
        }).catch(error => error.message);
    }

    static deleteKrant(huidig: Krant): Promise<string> {
        return deleteObject(refS(this.storage, `${huidig.uid}.pdf`)).then(() => {
            return remove(refD(this.database, `/uitgaves/${huidig.uid}`)).then(() => "").catch(error => error.message);            
        }).catch(error => error.message);
    }

    static storeSubscription(subscription: PushSubscription): Promise<string> {
        return set(refD(this.database, `/subscriptions/${User.current.getUid()}`), subscription.toJSON()).then(() => "").catch(error => error.message);
    }

    static sendNotification(text: string): Promise<string> { 
        return get(refD(this.database, "/subscriptions")).then(snapshot => {
            snapshot.forEach(child => {
                const requestBody = {...child.val(), msg: text};
                let headers = new Headers();

                headers.append('Content-Type', 'application/json');
                headers.append("Access-Control-Allow-Origin", "*")

                console.log(requestBody);

                fetch('https://paninipepers.herokuapp.com/api/sendNotification', {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: headers
                });
            });
        }).then(() => "").catch(error => error.message);
    }
}

export function generateUid(length: number) {
    const src = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    let uid = "";

    for (let i = 0; i < length; i++) {
        uid += src[random(0, src.length - 1)];
    }

    return uid;
}
