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
import { LoanItemComponent } from './components/loan-item/loan-item.component';
import { BackgroundBlurDirective } from './directives/background-blur.directive';
import { UserCardComponent } from './components/user-card/user-card.component';
import { PictureSelectableComponent } from './components/picture-selectable/picture-selectable.component';
import { UserFormComponent } from './components/user-form/user-form.component';



@NgModule({
  declarations: [
    // directives
    ProgressDirective,
    BackgroundBlurDirective,
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
    LoanItemComponent,
    UserCardComponent,
    PictureSelectableComponent,
    UserFormComponent,
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
    LoanItemComponent,
    UserCardComponent,
    PictureSelectableComponent,
    UserFormComponent,
    // pipe
    LoanCompletedPipe,
    LatestThreePipe,
    // directive
    ProgressDirective,
    BackgroundBlurDirective
  ]
})
export class SharedModule { }
