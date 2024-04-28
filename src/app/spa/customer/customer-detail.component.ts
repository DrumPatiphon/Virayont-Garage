import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { faSave,faTrash } from '@fortawesome/free-solid-svg-icons';
import { CustomerService, Customer } from './customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserData } from '../task/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/shared/Validators/custom.validators';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerDetailComponent implements OnInit {
  saveIcon = faSave
  deleteIcon = faTrash

  customerForm! : FormGroup;
  customer : Customer = {} as Customer;
  customerId: number | null = null;
  user: UserData = {} as UserData;

  constructor ( 
    private fb : UntypedFormBuilder,
    private route: ActivatedRoute,
    private router : Router,
    private se : CustomerService,
    private authService: AuthService,
    private ms: ToastrService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if(!this.user || this.user.userRole == 'customer'){
      this.router.navigate(['/login']);
    }
    const customerIdParam = this.route.snapshot.paramMap.get('customerId');
    this.customerId = customerIdParam ? +customerIdParam : null;
    this.createForm();
    this.rebuildForm();
    this.installEvent();
  }

  createForm() {
    this.customerForm = this.fb.group({
      address: [null,[Validators.required]],
      company_name: null,
      customer_id: null,
      customer_str_id: "AUTO",
      first_name: [null,[Validators.required]],
      last_name: [null,[Validators.required]],
      phone_number: [null,[Validators.required, CustomValidators.phoneNo()]],
    });
  }

  rebuildForm(): void{
    if(this.customerId){
      const controls = this.customerForm.controls
      if(this.customer){
        this.se.findCusByKey(this.customerId).subscribe(res => {
          this.customer = res
          this.customerForm.patchValue(this.customer, { emitEvent: false });
          this.customerForm.controls['customer_str_id'].setValue(this.customer.customer_id?.toString());
        });
      }
    }else{

    }
    this.customerForm.markAsPristine();
  }

      
  installEvent(){

  }

  save(action: string) { 
    if(this.isFormValid(this.customerForm)){
      this.se.save(this.customer,
                   this.customerForm.getRawValue(),
                   action,
        )
        .pipe(
        switchMap(result => this.se.findCusByKey(result))
      ).subscribe((result: any) => {
        this.customer = result;
        this.customerId = result.customer_id;
        this.rebuildForm();
      });
      this.ms.success('บันทึกสำเร็จ');
    }
  }

  delete(action: string){
    this.se.save(this.customer,
                 this.customerForm.getRawValue(),
                 action,
    ).subscribe(res => {
      if(res){
        this.ms.success('ลบข้อมูลสำเร็จ');
        this.router.navigate(['/customer']);
      }
    })
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
    const control = this.customerForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

}
