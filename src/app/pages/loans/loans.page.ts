import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LoanService } from 'src/app/core/services/loan.service';

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

}
