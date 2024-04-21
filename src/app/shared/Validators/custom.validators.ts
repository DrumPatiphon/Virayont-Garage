import { AbstractControl, ValidatorFn, Validators } from "@angular/forms"

export class CustomValidators extends Validators{

    static phoneNo(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          if (control.value) {
            if (!/^\d+$/.test(control.value)) {
              return { phoneNo: true };
            }
          }
          return null;
        };
      }
}