/**
 * Represents a loan with its unique identifier and attributes including type,
 * amount paid, total amount, completion status, and title.
 */
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
