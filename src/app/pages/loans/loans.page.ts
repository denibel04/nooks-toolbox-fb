import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Loan } from 'src/app/core/interfaces/loan';
import { LoanService } from 'src/app/core/services/loan.service';
import { LoanFormComponent } from 'src/app/shared/components/loan-form/loan-form.component';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.page.html',
  styleUrls: ['./loans.page.scss'],
})
export class LoansPage implements OnInit {

  constructor(
    public loanService: LoanService,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.loanService.getAll().subscribe()
  }

  async presentForm(data: Loan | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: LoanFormComponent,
      componentProps: {
        loan: data
      }
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        onDismiss(result);
      }
    })
  }

  
  onNewLoan() {
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'submit': {
          this.loanService.addLoan(info.data).subscribe();
        }
          break;
        default: {
          console.error("Error");
        }
      }
    }
    this.presentForm(null, onDismiss);
  }

}
