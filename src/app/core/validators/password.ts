import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
export class PasswordValidation {

    /**
     * Validator function to enforce strong password criteria.
     * @param controlName Optional name of the form control if control is not instance of FormControl.
     * @returns Validator function for password validation.
     */
    public static passwordProto(controlName: string = ''): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let password = '';
            if (control instanceof FormControl)
                password = control?.value;
            else
                password = control.get(controlName)?.value;
            if (password && !password.match(/^(?=.*\d)(?=.*[a-zá-ú\u00f1ä-ü])(?=.*[A-ZÁ-Ú\u00d1Ä-Ü])[0-9a-zá-úä-üA-ZÁ-ÚÄ-Ü \u00d1$-/@:-?{-~!"^_`\[\]]{8,}$/)) {
                return { 'passwordProto': true };
            }
            else {
                return null;
            }
        }
    }

    /**
     * Validator function to confirm password match with a specified control.
     * @param passwordControlName Name of the password form control.
     * @param confirmControlName Name of the confirmation form control.
     * @returns Validator function for password confirmation.
     */
    public static passwordMatch(passwordControlName: string, confirmControlName: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get(passwordControlName)?.value;
            const confirmPassword = control.get(confirmControlName)?.value;
            if (password != confirmPassword) {
                let errors = control?.errors;
                if (errors && typeof errors === 'object') {
                    Object.assign(errors, {
                        'passwordMatch': true
                    });
                } else {
                    errors = {
                        'passwordMatch': true
                    };
                }
                return errors;
            }
            else {
                let errors = control?.errors;
                if (errors && typeof errors === 'object') {
                    if (errors['passwordMatch'])
                        delete errors['passwordMatch'];
                }
                return control.errors;
            }
        }
    }
}