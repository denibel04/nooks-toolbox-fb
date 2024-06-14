import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Loan } from 'src/app/core/interfaces/loan';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
})
export class LoanComponent  implements OnInit {

  @Output() onEditClicked:EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeleteClicked:EventEmitter<void> = new EventEmitter<void>();

  @Input() loan:Loan | null = null;

  percentage:number =0
  

  constructor() { }

  /**
   * Initializes the component and calculates the percentage of the loan amount paid if loan attributes are available.
   */
  ngOnInit() {
    if (this?.loan?.attributes && this.loan.attributes.amountTotal !== 0) {
      this.percentage = (this.loan.attributes.amountPaid / this.loan.attributes.amountTotal) * 100;
    }
  }

   /**
   * Handles click events on the edit button.
   * @param event The click event object.
   */
  onEditClick(event:any) {
    event.stopPropagation();
    this.onEditClicked.emit();
  }

   /**
   * Handles click events on the delete button.
   * @param event The click event object.
   */
  onDeleteClick(event:any) {
    event.stopPropagation();
    this.onDeleteClicked.emit();
  }

}
