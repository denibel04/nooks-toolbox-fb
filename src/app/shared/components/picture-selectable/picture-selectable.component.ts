import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

export const PICTURE_SELECTABLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PictureSelectableComponent),
  multi: true
};

@Component({
  selector: 'app-picture-selectable',
  templateUrl: './picture-selectable.component.html',
  styleUrls: ['./picture-selectable.component.scss'],
  providers: [PICTURE_SELECTABLE_VALUE_ACCESSOR]
})
export class PictureSelectableComponent implements OnInit, ControlValueAccessor, OnDestroy {

  private _picture = new BehaviorSubject<string>("");
  public picture$ = this._picture.asObservable();
  isDisabled: boolean = false;
  hasValue: boolean = false;

  constructor(private pictureModal: ModalController) { }

   /**
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy(): void {
    this._picture.complete();
  }

  ngOnInit() {}
 /**
   * Placeholder function for propagating changes back to the form control.
   * @param obj The value to propagate.
   */
  propagateChange = (obj: any) => {}
 /**
   * Writes a new value to the component from the form control.
   * @param obj The value to write.
   */
  writeValue(obj: any): void {
    if (obj) {
      this.hasValue = true;
      this._picture.next(obj);
    }
  }
 /**
   * Registers a callback function to propagate changes to the form control.
   * @param fn The callback function.
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
 /**
   * Placeholder function for registering when the component is touched (for ControlValueAccessor).
   * @param fn The callback function.
   */
  registerOnTouched(fn: any): void {}

  /**
   * Sets the disabled state of the component.
   * @param isDisabled Whether the component should be disabled or not.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
 /**
   * Handles the change of picture selection.
   * @param base64 The base64 representation of the selected picture.
   * @param file The selected file object.
   */
  changePicture(base64: string, file: any) {
    this.hasValue = base64 !== '';
    this._picture.next(base64);
    this.propagateChange(file);
  }
 /**
   * Handles the change event when a new picture is selected.
   * @param event The change event from the file input.
   * @param fileLoader The HTML input element for file loading.
   */
  onChangePicture(event: any, fileLoader: HTMLInputElement) {
    event.stopPropagation();
    fileLoader.onchange = () => {
      if (fileLoader.files && fileLoader.files.length > 0) {
        const file = fileLoader.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.changePicture(reader.result as string, file);
        };
        reader.onerror = (error) => {
          console.log(error);
        };
        reader.readAsDataURL(file);
      }
    };
    fileLoader.click();
  }
 /**
   * Handles the event when the user wants to delete the current picture.
   * @param event The click event.
   */
  onDeletePicture(event: Event) {
    event.stopPropagation();
    this.changePicture('', null);
  }
 /**
   * Closes the modal displaying the picture selector.
   */
  close() {
    this.pictureModal.dismiss();
  }
}
