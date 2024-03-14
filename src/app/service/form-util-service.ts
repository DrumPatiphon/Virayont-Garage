import { Injectable } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";

@Injectable()
export class FormUtilService {

    markFormGroupTouched(formGroup: UntypedFormGroup) {
        (Object as any).values(formGroup.controls).forEach((control: UntypedFormGroup) => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    isFormGroupsValid(formGroups: UntypedFormGroup[], showWarning: boolean = true) {
        let isInvalid = false;
        if (formGroups && formGroups.length > 0) {
            formGroups.forEach(formGroup => {
                this.markFormGroupTouched(formGroup);
                isInvalid = isInvalid || formGroup.invalid;
            });
        }
        if (isInvalid) {
            return false;
        } else {
            return true;
        }
    }
}