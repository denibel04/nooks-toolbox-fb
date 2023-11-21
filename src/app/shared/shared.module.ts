import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VillagerComponent } from './components/villager/villager.component';
import { IslandComponent } from './components/island/island.component';
import { IslandFormComponent } from './components/island-form/island-form.component';



@NgModule({
  declarations: [
    // directives
    // pipes
    // components
    VillagerComponent,
    IslandComponent,
    IslandFormComponent

  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    VillagerComponent,
    IslandComponent,
    IslandFormComponent
  ]
})
export class SharedModule { }
