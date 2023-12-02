import { Pipe, PipeTransform } from '@angular/core';
import { Loan } from 'src/app/core/interfaces/loan';

@Pipe({
  name: 'loanCompleted'
})
export class LoanCompletedPipe implements PipeTransform {

  transform(loans: Loan[], completed: boolean): Loan[] {
    if (!loans) {
      return [];
    }
    return loans.filter(loan => loan.attributes.completed === completed);
  }

}
