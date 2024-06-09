import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { DividerModule } from 'primeng/divider';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    SharedModule,
    DividerModule,
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {}
