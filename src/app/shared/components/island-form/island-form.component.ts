import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
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
  villager?:Villager;
  _island: Island | null = null
  mode: 'New' | 'Edit' = 'New';

  @Input() set island(_island: Island | null) {
    if (_island) {
      this.mode = 'Edit';
      this.form.controls['islandName'].setValue(_island.attributes.islandName);
      console.log("island", _island.attributes.villagers)
      if (_island.attributes.villagers) {
        this.villagerService.getVillager(_island.attributes.villagers[0]?.id).subscribe(res=> {
          this.villager = res;
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
    private villagerService:VillagerService
  ) {
    this.form = this.formBuilder.group({
      islandName: ['', [Validators.required]],
      villagers: [this.formBuilder.array([])]
    })
  }

  ngOnInit() { }

  onCancel() {
    this.formModal.dismiss(null, 'cancel')
  }

  onSubmit() {
    this.formModal.dismiss(this.form.value, 'submit')
  }

  onDelete() {
    this.formModal.dismiss(this.form.value, 'delete')
  }


}