import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Loan } from 'src/app/core/interfaces/loan';

@Component({
  selector: 'app-loan-item',
  templateUrl: './loan-item.component.html',
  styleUrls: ['./loan-item.component.scss'],
})
export class LoanItemComponent  implements OnInit {

  @Output() onLoanClicked:EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeleteClicked:EventEmitter<void> = new EventEmitter<void>();

  @Input() loan:Loan | null = null;

  percentage:number =0
  

  constructor() { }

  ngOnInit() {
    if (this?.loan?.attributes && this.loan.attributes.amountTotal !== 0) {
      this.percentage = (this.loan.attributes.amountPaid / this.loan.attributes.amountTotal) * 100;
    }
  }

  onEditClick(event:any) {
    event.stopPropagation();
    this.onLoanClicked.emit();
  }

  onDeleteClick(event:any) {
    event.stopPropagation();
    this.onDeleteClicked.emit();
  }

  getProgressPercentage():number {
    if (!this.loan) {
      return 0; 
    }
    return (this.loan.attributes.amountPaid / this.loan.attributes.amountTotal) * 100;
  }


}
