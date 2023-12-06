import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Island } from 'src/app/core/interfaces/island';
import { Villager } from 'src/app/core/interfaces/villager';
import { VillagerService } from 'src/app/core/services/villager.service';

@Component({
  selector: 'app-island-form',
  templateUrl: './island-form.component.html',
  styleUrls: ['./island-form.component.scss'],
})
export class IslandFormComponent implements OnInit {

  form: FormGroup;
  villagers:Villager[] = [];
  _island: Island | null = null
  mode: 'New' | 'Edit' = 'New';
  numbers = [0,1,2,3,4,5,6,7,8,9];

  @Input() set island(_island: Island | null) {
    if (_island) {
      this.mode = 'Edit';
      this.form.controls['islandName'].setValue(_island.attributes.islandName);
      console.log("island", _island.attributes.villagers)
      if (_island.attributes.villagers) {
        _island.attributes.villagers.forEach((villager, index)=>{
          this.form.controls['villager'+(index+1)].setValue(_island.attributes.villagers![index]);
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
    private villagerService:VillagerService,
    private alertController: AlertController
  ) {
    this.form = this.formBuilder.group({
      islandName: ['', [Validators.required]],
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

  async ngOnInit() { 
    this.villagers = await lastValueFrom(this.villagerService.getFiltered(""));
  }

  onCancel() {
    this.formModal.dismiss(null, 'cancel')
  }

  onSubmit() {
    this.formModal.dismiss(this.form.value, 'submit')
  }

  async onDelete() {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: '¿Estás seguro?',
      message: 'Al eliminar esta isla se eliminarán todas las deudas relacionadas.',
      buttons: [
        {
          text: 'Cancelar',
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

  onVillagerSelect(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }


}