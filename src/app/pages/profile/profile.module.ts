import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from 'src/app/shared/shared.module';

import { TabViewModule } from 'primeng/tabview';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProfilePageRoutingModule, 
    SharedModule,
    TabViewModule,
    AvatarModule,
    BadgeModule,
    TabMenuModule,
    ButtonModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
