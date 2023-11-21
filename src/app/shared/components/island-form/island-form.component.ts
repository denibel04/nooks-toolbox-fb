import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Island } from 'src/app/core/interfaces/island';

@Component({
  selector: 'app-island-form',
  templateUrl: './island-form.component.html',
  styleUrls: ['./island-form.component.scss'],
})
export class IslandFormComponent implements OnInit {

  form: FormGroup;
  mode: 'New' | 'Edit' = 'New';

  @Input() set island(_island: Island | null) {
    if (_island) {
      this.mode = 'Edit';
      this.form.controls['id'].setValue(_island.id);
      this.form.controls['islandName'].setValue(_island.attributes.islandName);
    }
  }

  constructor(
    private formModal: ModalController,
    private formBuilder: FormBuilder,
  ) {

    this.form = this.formBuilder.group({
      islandName: ['', [Validators.required]],
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