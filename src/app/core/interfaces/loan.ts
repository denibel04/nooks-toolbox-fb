export interface Loan {
    id:number,
    attributes: {
        type:string,
        amountPaid:number,
        amountTotal:number,
        completed:boolean,
        title:string
    }
}
