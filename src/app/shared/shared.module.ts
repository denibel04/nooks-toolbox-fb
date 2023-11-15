import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VillagerComponent } from './components/villager/villager.component';



@NgModule({
  declarations: [
    // directives
    // pipes
    // components
    VillagerComponent

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
    VillagerComponent
  ]
})
export class SharedModule { }
