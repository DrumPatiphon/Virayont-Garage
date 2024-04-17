import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { faSave,faTrash } from '@fortawesome/free-solid-svg-icons';
import { CustomerService, Customer } from './customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

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

  constructor ( 
    private fb : UntypedFormBuilder,
    private route: ActivatedRoute,
    private router : Router,
    private se : CustomerService,
  ) {}

  ngOnInit(): void {
    const customerIdParam = this.route.snapshot.paramMap.get('customerId');
    this.customerId = customerIdParam ? +customerIdParam : null;
    this.createForm();
    this.rebuildForm();
    this.installEvent();
  }

  createForm() {
    this.customerForm = this.fb.group({
      address: null,
      company_name: null,
      customer_id: null,
      customer_str_id: "AUTO",
      first_name: null,
      last_name: null,
      phone_number: null,
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
  }

  delete(action: string){
    this.se.save(this.customer,
                 this.customerForm.getRawValue(),
                 action,
    ).subscribe(res => {
      if(res){
        this.router.navigate(['/customer']);
      }
    })

  }

}
