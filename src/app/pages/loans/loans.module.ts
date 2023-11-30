import { NgModule } from '@angular/core';

import { LoansPageRoutingModule } from './loans-routing.module';

import { LoansPage } from './loans.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    LoansPageRoutingModule,
    SharedModule
  ],
  declarations: [LoansPage]
})
export class LoansPageModule {}
