import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from 'src/app/shared/shared.module';

import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';

import { NgOtpInputModule } from 'ng-otp-input';



import { InputMaskModule } from 'primeng/inputmask';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProfilePageRoutingModule, 
    SharedModule,
    TabViewModule,
    InputTextModule,
    NgOtpInputModule,
    InputMaskModule,
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
