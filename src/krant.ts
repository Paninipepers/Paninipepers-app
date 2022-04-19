export class Krant {
    readonly pages!: number[];

    constructor(readonly url: string, readonly date: Date, readonly uid: string, readonly name: string, pages?: number[]) {
        this.pages = pages || [];
    }
}
