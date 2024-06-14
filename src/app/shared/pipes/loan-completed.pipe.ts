import { Pipe, PipeTransform } from '@angular/core';
import { Loan } from 'src/app/core/interfaces/loan';

@Pipe({
  name: 'loanCompleted'
})
export class LoanCompletedPipe implements PipeTransform {

 /**
   * Transforms an array of loans to return only those that match the completed status.
   * @param loans The array of loans to be filtered.
   * @param completed The completion status to filter by.
   * @returns The filtered array of loans.
   */
  transform(loans: Loan[], completed: boolean): Loan[] {
    if (!loans) {
      return [];
    }
    return loans.filter(loan => loan.attributes.completed === completed);
  }

}
