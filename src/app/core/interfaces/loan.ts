export interface Loan {
    id:string,
    attributes: {
        type:string,
        amountPaid:number,
        amountTotal:number,
        completed:boolean,
        title:string
    }
}
