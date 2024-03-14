import { Component ,OnInit} from '@angular/core';
import { ApiService, Customer } from './api.service';
import { FormBuilder , FormGroup ,Validators} from '@angular/forms';


@Component({
  selector: 'app-cus-detail',
  templateUrl: './cus-detail.component.html',
  styleUrls: ['./cus-detail.component.css']
})
export class CusDetailComponent implements OnInit{

  Customerform! : FormGroup;

  constructor ( 
    private fb : FormBuilder,
    private cus : ApiService
) {}

    

  Customer: Customer[] = [];
  ngOnInit(): void {
     
    this.cus.getCustomer().subscribe((data) =>{ 
      console.log(data)
      this.Customer = data;
    })
    console.log(this.Customer)


    this.createForm();
    this.cus.getCustomer().subscribe((data) =>{
    this.Customer = data;
    this.Customerform.controls['address'].setValue(data[0].address)
    this.Customerform.controls['company_name'].setValue(data[0].company_name)
    this.Customerform.controls['customer_id'].setValue(data[0].customer_id)
    this.Customerform.controls['first_name'].setValue(data[0].first_name)
    this.Customerform.controls['last_name'].setValue(data[0].last_name)
    this.Customerform.controls['phone_number'].setValue(data[0].phone_number)
    
    })
    
    
  }

  createForm() {
    this.Customerform = this.fb.group({
    address: null,
    company_name: null, 
    customer_id: null,
    first_name: null,
    last_name: null,
    phone_number: null,
    
    })
  }


}
