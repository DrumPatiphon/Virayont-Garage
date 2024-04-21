import { Component, OnInit } from '@angular/core';
import { RegisterService, Customer } from './register.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from '../shared/Validators/custom.validators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm! : FormGroup;
  register : Customer = {} as Customer;

  constructor ( 
    private fb : UntypedFormBuilder,
    private route: ActivatedRoute,
    private router : Router,
    private se : RegisterService,
    private ms: ToastrService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.rebuildForm();
    this.installEvent();
  }

  createForm() {
    this.registerForm = this.fb.group({
      phone_number: [null,[Validators.required, CustomValidators.phoneNo()]],
      first_name: [null,[Validators.required]],
      last_name: [null,[Validators.required]],
      address: [null,[Validators.required]],
      company_name: null,
    });
  }

  rebuildForm(): void{

  }

  installEvent(){

  }

  async save(action: string) { 
    this.se.save(this.register,
                 this.registerForm.getRawValue(),
                 action,
      ).subscribe((result: any) => {
      this.ms.success('สมัครสมาชิกสำเร็จ');
      this.rebuildForm();
      this.router.navigate(['/login']);
    });
  }

  isFormValid(formGroup: FormGroup): boolean {
    let isValid = true;

    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        if (!this.isFormValid(control)) {
          isValid = false;
        }
      } else {
        control.markAsTouched();
        if (control.invalid) {
          isValid = false;
        }
      }
    });

    if(!isValid){
      this.ms.error('กรุณาตรวจสอบข้อมูลให้ถูกต้อง');
    }

    return isValid;
  }

  isInvalid(controlName: string){
    const control = this.registerForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

  async isDuplicateUser(){
    if(this.isFormValid(this.registerForm) ){
      const param = {
        PhoneNumber : this.registerForm.controls['phone_number'].value,
        Name : this.registerForm.controls['first_name'].value,
      }
      try {
        const res = await this.se.duplicateCheck(param).toPromise()
        if(res){
          this.ms.error('มีผู้ใช้นี้อยู่แล้วในระบบ');
        }else{
          this.save('Save');
        }
        return res;
      } catch (error) {
        this.ms.error('เกิดข้อผิดพลาดกรุณาติดต่อผู้ดูแลระบบ');
      }
    }
  }
}
