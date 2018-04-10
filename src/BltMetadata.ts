export class BltMetadata {

    readonly date : Date;
    readonly transactionIndex : number;

    constructor(transactionIndex : number) {
        this.transactionIndex = transactionIndex
        this.date = new Date();
    }

}