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
import { ProgressDirective } from './directives/progress.directive';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../core/services/custom-translate.service';
import { HttpClient } from '@angular/common/http';
import { LatestThreePipe } from './pipes/latest-three.pipe';



@NgModule({
  declarations: [
    // directives
    ProgressDirective,
    // pipes
    LoanCompletedPipe,
    LatestThreePipe,
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
    LoanCompletedPipe,
    ProgressDirective,
    LatestThreePipe,

  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
      }),
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
    TranslateModule,
    // pipe
    LoanCompletedPipe,
    LatestThreePipe,
    // directive
    ProgressDirective
  ]
})
export class SharedModule { }
