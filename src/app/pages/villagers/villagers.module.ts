import { NgModule } from '@angular/core';

import { VillagersPageRoutingModule } from './villagers-routing.module';
import { VillagersPage } from './villagers.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

@NgModule({
  imports: [
    VillagersPageRoutingModule,
    SharedModule,
    OverlayPanelModule,
    VirtualScrollerModule
  ],
  declarations: [VillagersPage]
})
export class VillagersPageModule {}
