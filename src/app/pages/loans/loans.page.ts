import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Island } from 'src/app/core/interfaces/island';
import { Loan } from 'src/app/core/interfaces/loan';
import { AuthStrapiService } from 'src/app/core/services/api/strapi/auth-strapi.service';
import { IslandService } from 'src/app/core/services/island.service';
import { LoanService } from 'src/app/core/services/loan.service';
import { LoanFormComponent } from 'src/app/shared/components/loan-form/loan-form.component';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.page.html',
  styleUrls: ['./loans.page.scss'],
})
export class LoansPage implements OnInit {

  _island: Island | null = null;
  isModalOpen = false;

  constructor(
    public loanService: LoanService,
    private modal: ModalController,
    private authService:AuthStrapiService,
    private islandService:IslandService
  ) { }

  async ngOnInit() {
    const user = await lastValueFrom(this.authService.me());
    this._island = await lastValueFrom(this.islandService.getIsland(user.island.data.id));
    this.loanService.getUserLoans().subscribe()
  };


  async presentForm(data: Loan | null, onDismiss: (result: any) => void) {
    const modal = await this.modal.create({
      component: LoanFormComponent,
      componentProps: {
        loan: data
      }
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      this.isModalOpen = false;
      if (result && result.data) {
        onDismiss(result);
      }
    })
  }

  
  onNewLoan() {
    this.isModalOpen = true;

    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'submit': {
          this.loanService.addLoan(info.data).subscribe();
        }
          break;
        default: {
          this.isModalOpen = false;
        }
      }
    }
    this.presentForm(null, onDismiss);
  }

  onEditClicked(loan: Loan) {
    this.isModalOpen = true;
    var onDismiss = (info: any) => {
      switch (info.role) {
        case 'submit': {
          loan.attributes= info.data
          this.loanService.updateLoan(loan).subscribe();
        }
          break;
        default: {
          this.isModalOpen = false;
        }
      }
    }
    this.presentForm(loan, onDismiss);
  }

  onDeleteClicked(loan:Loan) {
    this.loanService.deleteLoan(loan).subscribe()
  }

}
