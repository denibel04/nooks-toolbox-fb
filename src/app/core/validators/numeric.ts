import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
   * Returns a validator function that validates numeric input.
   * @param formControlName Optional name of the form control if control is not instance of FormControl.
   * @returns Validator function for numeric validation.
   */
export class numericValidator{
    public static numericProto(formControlName:string=''): ValidatorFn{
        return (control: AbstractControl): ValidationErrors | null => {
            let value = '';
            if(control instanceof FormControl)
                value = control?.value;
            else
                value = control.get(formControlName)?.value;
            let errors = control?.errors;
            if (value === null || value === '') {
                return errors; 
                
            }
            const regex = /^[-+]?[0-9]*\.?[0-9]{0,2}$/;
            const valid = regex.test(value);
            return valid ? null : { 'numeric': true };
        }
    }
}