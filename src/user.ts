import { generateUid } from "./firebase";

export class User {
    private uid: string;
    private static firstVisit = () => {};
    public static current: User = null;

    constructor() {
        this.uid = localStorage.getItem("uid");

        if (this.uid === null) {
            this.uid = generateUid(15);
            localStorage.setItem("uid", this.uid);
            
            User.firstVisit();
        }
    }

    static set onFirstVisit(callback: () => void) {
        this.firstVisit = callback;
    }

    getUid(): string {
        return this.uid;

    }
}