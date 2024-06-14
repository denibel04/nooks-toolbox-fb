import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { Island } from 'src/app/core/interfaces/island';
import { Villager } from 'src/app/core/interfaces/villager';
import { VillagerService } from 'src/app/core/services/villager.service';

@Component({
  selector: 'app-island-form',
  templateUrl: './island-form.component.html',
  styleUrls: ['./island-form.component.scss'],
})
export class IslandFormComponent {

  form: FormGroup;
  _island: Island | null = null
  mode: 'New' | 'Edit' = 'New';
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  @Input() set island(_island: Island | null) {
    if (_island) {
      this.mode = 'Edit';
      this.form.controls['name'].setValue(_island.attributes.name);
      console.log("island", _island.attributes.villagers)
      if (_island.attributes.villagers) {
        _island.attributes.villagers.forEach((villager, index) => {
          this.form.controls['villager' + (index + 1)].setValue(_island.attributes.villagers![index]);
        })
      }
    }
  }


  get island(): Island | null {
    return this._island;
  }

  constructor(
    private formModal: ModalController,
    private formBuilder: FormBuilder,
    private villagerService: VillagerService,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      villager1: [undefined],
      villager2: [undefined],
      villager3: [undefined],
      villager4: [undefined],
      villager5: [undefined],
      villager6: [undefined],
      villager7: [undefined],
      villager8: [undefined],
      villager9: [undefined],
      villager10: [undefined]

    })
  }

  /**
 * Cancels the form operation and dismisses the modal with 'cancel' action.
 */
  onCancel() {
    this.formModal.dismiss(null, 'cancel')
  }

  /**
  * Submits the form data and dismisses the modal with 'submit' action, passing the form value.
  */
  onSubmit() {
    this.formModal.dismiss(this.form.value, 'submit')
  }

  /**
   * Deletes the current island data, showing a confirmation alert before dismissal.
   * Dismisses the modal with 'delete' action if confirmed.
   */
  async onDelete() {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: await lastValueFrom(this.translate.get('island.alert.header')),
      message: await lastValueFrom(this.translate.get('island.alert.message')),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('island.alert.cancel')),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.formModal.dismiss(this.form.value, 'delete');
          }
        }
      ]

    });

    await alert.present();
  }
}