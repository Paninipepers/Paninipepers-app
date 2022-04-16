import { generateUid } from "./firebase";

export class User {
    public uid: string;
    private _notifications: boolean;
    private static firstVisit = () => {};
    public static current: User = null;

    constructor() {
        this.uid = localStorage.getItem("uid");
        this._notifications = (localStorage.getItem("notifications") || "false") === "true";

        if (this.uid === null) {
            this.uid = generateUid(15);
            localStorage.setItem("uid", this.uid);
            
            User.firstVisit();
        }
    }

    static set onFirstVisit(callback: () => void) {
        this.firstVisit = callback;
    }

    get notifications(): boolean {
        return this._notifications;
    }

    set notifications(value: boolean) {
        this._notifications = value;
        localStorage.setItem("notifications", value.toString());
    }
}