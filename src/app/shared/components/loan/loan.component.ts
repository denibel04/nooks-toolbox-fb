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

  constructor() { }

  ngOnInit() {}

  onEditClick(event:any) {
    event.stopPropagation();
    this.onEditClicked.emit();
    
    console.log("Clic en el botón de edición");
  }

  onDeleteClick(event:any) {
    event.stopPropagation();
    this.onDeleteClicked.emit();
  }

  

}
