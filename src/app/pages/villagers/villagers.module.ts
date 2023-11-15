import { NgModule } from '@angular/core';

import { VillagersPageRoutingModule } from './villagers-routing.module';
import { VillagersPage } from './villagers.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    VillagersPageRoutingModule,
    SharedModule
  ],
  declarations: [VillagersPage]
})
export class VillagersPageModule {}
