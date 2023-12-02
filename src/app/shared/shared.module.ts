import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VillagerComponent } from './components/villager/villager.component';
import { IslandComponent } from './components/island/island.component';
import { IslandFormComponent } from './components/island-form/island-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { VillagerItemComponent } from './components/villager-item/villager-item.component';
import { VillagerSelectableComponent } from './components/villager-selectable/villager-selectable.component';
import { LoanComponent } from './components/loan/loan.component';
import { LoanFormComponent } from './components/loan-form/loan-form.component';
import { LoanCompletedPipe } from './pipes/loan-completed.pipe';



@NgModule({
  declarations: [
    // directives
    // pipes
    LoanCompletedPipe,
    // components
    VillagerComponent,
    IslandComponent,
    IslandFormComponent,
    LoginFormComponent,
    RegisterFormComponent,
    VillagerItemComponent,
    VillagerSelectableComponent,
    LoanComponent,
    LoanFormComponent,
    LoanCompletedPipe

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
    // components
    VillagerComponent,
    IslandComponent,
    IslandFormComponent,
    LoginFormComponent,
    RegisterFormComponent,
    VillagerItemComponent,
    VillagerSelectableComponent,
    LoanComponent,
    LoanFormComponent,
    // pipe
    LoanCompletedPipe
  ]
})
export class SharedModule { }
