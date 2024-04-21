import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoninService } from './login.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from '../shared/Validators/custom.validators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm! : FormGroup;

  constructor ( 
    private fb : UntypedFormBuilder,
    private route: ActivatedRoute,
    private router : Router,
    private se : LoninService,
    private ms: ToastrService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.installEvent();
  }

  createForm() {
    this.loginForm = this.fb.group({
      phoneNumber: [null,[Validators.required, CustomValidators.phoneNo()]],
      password: null,
      empCheckBox: false
    });
  }

  installEvent(){
    this.loginForm.controls['empCheckBox'].valueChanges.subscribe(res => {
      if(res){
        this.loginForm.controls['password'].setValidators([Validators.required]);
        this.loginForm.controls['password'].updateValueAndValidity();
        this.loginForm.controls['password'].markAsUntouched();
      }else{
        this.loginForm.controls['password'].clearValidators();
        this.loginForm.controls['password'].updateValueAndValidity();
        this.loginForm.controls['password'].markAsUntouched();
      }
    })
  }

  login(){
    if(this.isFormValid(this.loginForm)){
      this.se.login(this.loginForm.value)
      .subscribe(res => {
        if(res.length > 0){
          this.authService.login(res[0]);
          if(this.loginForm.controls['empCheckBox'].value){
            this.router.navigate(['/admin'])
          }else{
            this.router.navigate(['/task'])
          }
        }else{
          if(this.loginForm.controls['empCheckBox'].value){
            this.ms.error('เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง');
          }else{
            this.ms.error('ไม่มีผู้ใช้นี้ในระบบ');
          }
        }
      });
    }
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
    const control = this.loginForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }


}
